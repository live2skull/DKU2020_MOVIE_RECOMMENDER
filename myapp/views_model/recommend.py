from django.urls import path, include
from typing import List
from rest_framework.routers import DefaultRouter

from rest_framework.views import APIView
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

recommendation = MovieRecommendation()

## TODO: 사용자 아이디 변경 필요 (로그인 기능 등 구현시)


class UserBasedRecommendView(APIView):

    def get(self, request, format=None):
        """
        Return a list of all users.
        """

        user_id = int(request.query_params['user'])
        recommends = recommendation.get_recommendations_user_based(
            User.objects.get(id=user_id)
        ) # type: List[Movie]

        return Response(recommends)


