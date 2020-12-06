## 영화 추천 기능 정의 집합입니다.
# @package myapp.MovieRecommendation

import warnings
from decimal import Decimal
from typing import Generator, List, Set
from logging import getLogger
from django.db.models import QuerySet, Q

from .models import Movie, Genre, Actor, MovieUserComment, MovieUser
from .models import User, UserComment

logger = getLogger(__name__)


## User based 추천 알고리즘에서 매칭할 최대 사용자 수 입니다.
MAX_MATCHED_USERS = 100
## User based 추천 알고리즘에서 매칭할 사용자별 최대 평가 수 입니다.
MAX_COMMENTS_EACH_MATCHED_USER = 20


## 영화 추천 클래스 (MovieRecommendation)의 오류를 정의합니다.
class RecommendationException(Exception):

    detail = None # type: str

    def __init__(self, detail: str):
        self.detail = detail

    def __str__(self):
        return self.detail


## 영화 추천 기능을 제공합니다.
class MovieRecommendation:

    ## User based 알고리즘으로 추천 영화 리스트를 반환합니다.
    # 사용자는 최소 2개부터 최대 5개까지의 영화를 선택한 상태여야 합니다.
    #  @param user: 영화 추천 대상 사용자입니다.
    #  @param allowance: 허용할 별점의 오차입니다. 기본값은 3입니다.
    #  @param maximum: 최대 결과의 갯수입니다. 기본값은 30입니다.
    #  @return: 추천될 영화 리스트입니다.
    def get_recommendations_user_based(self, user: User, allowance=2, maximum=30) -> List[Movie]:

        ## 2020. 11. 24 수정
        ## maximum 값은 사실상 전체 실행 속도에 크게 의미가 없으며,
        ## 활용 가능 사용자 수 matchedUsers 를 100 정도로 조정하여 다시 테스트합니다.

        userComments = list(user.comments.all()) # type: List[UserComment]

        # 사용자의 영화 평점이 존재하지 않거나 5개 이상인 경우, 진행할 수 없습니다.

        if not 5 >= len(userComments) >= 2:
            raise RecommendationException("추천을 위해 2개 이상, 5개 이하의 영화 리뷰를 작성해주세요.")

        ## TODO: 확인 대상 영화가 추천 댓글이 없는 경우?
        ## TODO: 우선 이대로 진행해도 되지 않을까 싶음.

        # 1. 추천을 원하는 대상 사용자의 모든 영화 평가를 불러옵니다.
        querySet = MovieUser.objects.all() # type: QuerySet


        ## 중복된 사용자가 나타남에 따라 set() 으로 변경함.
        # 2. 해당 사용자의 각 평가의 평점에 허용치(1~2)를 추가한 범위의 평가를 동일히 한 다른 사용자들을 불러옵니다.
        for userComment in userComments: # type: UserComment

            ## 허용치 값을 지정합니다.
            score_min = 0 if userComment.score - allowance < 0 else userComment.score - allowance
            score_max = 10 if userComment.score + allowance > 10 else userComment.score + allowance

            querySet = querySet.filter(Q(
                comments__movie_id=userComment.movie_id,
                comments__score__gte=score_min, comments__score__lte=score_max
            ))

        ## 현재까지는 저 내용과 모두 일치하는 사용자를 불러내었음.
        ## 수정한다면 - 각 스코어별로 해당하는 user들을 추리고, 영화 데이터를 일부분 가져온다. (order by)


        # 3. 해당 사용자들이 평가한 다른 영화 평점을 불러옵니다.
        # 점수 카운팅을 위한 임시변수
        movies_dict = {}
        matchedUsers = set(querySet.order_by('-score_avg')[:MAX_MATCHED_USERS])
        logger.debug("querySet executed : users: %s" % len(matchedUsers))

        for matchedUser in matchedUsers:

            # maximum - 20개까지 점수로 선정합니다.
            for comment in matchedUser.comments.order_by('-score')[:MAX_COMMENTS_EACH_MATCHED_USER]:
                movie_id = comment.movie_id

                if movie_id not in movies_dict.keys():
                    movies_dict.setdefault(movie_id, comment.score)
                else:
                    movies_dict[movie_id] += comment.score


        # 4. 각 영화에 대해 해당 사용자들의 평점을 전부 합산한 뒤, 내림차순에 정렬하여 추천 우선순위를 정합니다.
        # (movie_id, score) 형태의 튜플로 리스트에 삽입합니다.
        movies_list = []
        for key,value in movies_dict.items():
            movies_list.append((key, value)) # 튜플 형태로 삽입

        ## 마지막으로 점수를 통해 내림차순 정렬합니다.
        movies_list.sort(key=lambda x : x[1], reverse=True)
        return list(map(lambda x : Movie.objects.get(id=x[0]), movies_list[:maximum]))



    ## Item based 알고리즘으로 추천 영화 리스트를 반환합니다.
    # @warning: 구현되지 않았습니다.
    def get_recommendations_item_based(self, movie: Movie) -> List[Movie]:
        raise NotImplementedError("아직 구현되지 않았습니다.")

    ## Item based 알고리즘을 위한 아이템별 상관계수를 계산합니다.
    # @warning: 구현되지 않았습니다.
    def process_item_based_relation_value(self, src: Movie, dest: Movie) -> Decimal:
        raise NotImplementedError("아직 구현되지 않았습니다.")