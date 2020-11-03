import warnings
from typing import Generator, List

from django.db.models import QuerySet

from .NaverMovieParser import NaverMovieParser
from .NaverMovieRequester import NaverMovieRequester

from .models import Movie, Genre, Actor, MovieUserComment, MovieParseHistory, MovieUser
from .models import User, UserComment

class MovieRecommendation:
    pass

    def get_recommendations_user_based(self, user: User, weight=2) -> List[Movie]:
        """
        User based 알고리즘으로 추천 영화 리스트를 반환합니다.

        :param user: 영화 추천 대상 사용자입니다.
        :param weight: 허용할 별점의 가중치입니다. 기본값은 2입니다.
        :return: 추천될 영화 리스트입니다.
        """

        userComments = list(user.comments_user.all()) # type: List[UserComment]

        # 사용자의 영화 평점이 존재하지 않는 경우, 진행할 수 없습니다.
        if not len(userComments):
            return []

        querySet = MovieUser.objects.all() # type: QuerySet

        # 지정한 허용지 weight와 영화 평점을 가지고, 사용자와 비숏한 영화를 평가한 사용자 정보를 불러옵니다.
        for userComment in userComments: # type: UserComment
            ## 허용치 값을 지정합니다.

            score_min = 0 if userComment.score - weight < 0 else userComment.score - weight
            score_max = 10 if userComment.score + weight > 10 else userComment.score + weight

            querySet = querySet.filter(
                comments__score__gte=score_min, comments__score__lte=score_max)


        matchedUsers = list(querySet)
        for matchedUser in matchedUsers: # type: MovieUser
            ## TODO: 사용자별 영화 리스트 추출하여 중복제거 및 return
            pass



    def get_recommendations_item_based(self, movie: Movie) -> List[Movie]:
        """

        :param movie:
        :return:
        """
        pass
