## 영화 추천 정보를 제공하는 view 클래스의 집합입니다.
# @package myapp.views.recommend

from django.urls import path, include
from typing import List
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from ..models import Movie
from ..serializers.movie import MovieModelSerializer
from ..MovieRecommendation import MovieRecommendation
from . import PreFlightSupportAPIViewMixin

## 추천 정보 제공을 위한 MovieRecommendation 클래스의 인스턴스입니다.
recommendation = MovieRecommendation()

## 사용자에게 User-Based 기반 알고리즘으로 추천 영화 리스트를 제공합니다.
# 사용자는 2개 이상, 5개 이하의 리뷰를 작성해야 합니다.
class UserBasedRecommendView(PreFlightSupportAPIViewMixin, APIView):

    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, ):
        ## 현재 인증된 사용자에 대해 수행합니다.

        recommends = recommendation.get_recommendations_user_based(
            request.user
            # User.objects.get(id=user_id)
        ) # type: List[Movie]

        ## 리스트 형태의 데이터를 사용하므로, many 옵션이 설정되어야 합니다.
        serializer = MovieModelSerializer(recommends, many=True)
        return Response(serializer.data)


## 구현된 view에 대한 URL 정의입니다.
urlpatterns = [
    path('', UserBasedRecommendView.as_view()),
]
