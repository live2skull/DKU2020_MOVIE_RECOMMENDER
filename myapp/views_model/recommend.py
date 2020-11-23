from django.urls import path, include
from typing import List
from rest_framework.routers import DefaultRouter

from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from django_filters import rest_framework as filters

from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response


from ..models import MovieUser, Movie, User
from ..serializers.movie import MovieModelSerializer

from . import StandardPagnation


from ..MovieRecommendation import MovieRecommendation
from . import PreFlightSupportAPIViewMixin

recommendation = MovieRecommendation()

## TODO: 사용자 아이디 변경 필요 (로그인 기능 등 구현시)


class UserBasedRecommendView(PreFlightSupportAPIViewMixin, APIView):

    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, ):
        """
        Return a list of all users.
        """

        ## 현재 인증된 사용자에 대해 수행합니다.

        recommends = recommendation.get_recommendations_user_based(
            request.user
            # User.objects.get(id=user_id)
        ) # type: List[Movie]

        ## 리스트 형태의 데이터를 사용하므로, many 옵션이 설정되어야 합니다.
        serializer = MovieModelSerializer(recommends, many=True)
        return Response(serializer.data)


urlpatterns = [
    # path('<int:user_id>', UserBasedRecommendView.as_view()),
    path('', UserBasedRecommendView.as_view()),
]
