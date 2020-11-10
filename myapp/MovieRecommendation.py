import warnings
from decimal import Decimal
from typing import Generator, List, Set

from django.db.models import QuerySet

from .NaverMovieParser import NaverMovieParser
from .NaverMovieRequester import NaverMovieRequester

from .models import Movie, Genre, Actor, MovieUserComment, MovieParseHistory, MovieUser
from .models import User, UserComment

class MovieRecommendation:


    def get_recommendations_user_based(self, user: User, weight=2) -> List[Movie]:
        """
        User based 알고리즘으로 추천 영화 리스트를 반환합니다.

        :param user: 영화 추천 대상 사용자입니다.
        :param weight: 허용할 별점의 가중치입니다. 기본값은 2입니다.
        :return: 추천될 영화 리스트입니다.
        """

        userComments = list(user.comments.all()) # type: List[UserComment]

        # 사용자의 영화 평점이 존재하지 않는 경우, 진행할 수 없습니다.
        if not len(userComments):
            return list()

        querySet = MovieUser.objects.all() # type: QuerySet

        # 지정한 허용지 weight와 영화 평점을 가지고, 사용자와 비숏한 영화를 평가한 사용자 정보를 불러옵니다.
        for userComment in userComments: # type: UserComment
            ## 허용치 값을 지정합니다.

            score_min = 0 if userComment.score - weight < 0 else userComment.score - weight
            score_max = 10 if userComment.score + weight > 10 else userComment.score + weight

            querySet = querySet.filter(
                comments__movie_id=userComment.movie_id,
                comments__score__gte=score_min, comments__score__lte=score_max
            )
            

        ## Model : 객체 클래스 및 pk 값에 따라 equals 기능 지원함!
        movies_set = set() # type: Set[Movie]

        ## TODO: 해당 사용자가 "긍정적" 으로 평가한 영화에 대해 추출
        ## 긍정적 -> 몇점 이상? 사용자의 평균 이상? 아니면 절대적인 값?
        matchedUsers = list(querySet)
        for matchedUser in matchedUsers: # type: MovieUser
            for comment in matchedUser.comments.all():
                movies_set.add(comment.movie)

        ## 이 때 사용자가 없다면 그대로 반환됩니다.
        return list(movies_set)



    def get_recommendations_item_based(self, movie: Movie) -> List[Movie]:
        """

        :param movie:
        :return:
        """
        pass


    def process_item_based_relation_value(self, src: Movie, dest: Movie) -> Decimal:
        pass