from django.urls import path, include
from rest_framework.routers import DefaultRouter

from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet, GenericViewSet
from rest_framework.generics import ListAPIView
from rest_framework import filters

from django_filters import rest_framework as filters

from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import generics, mixins, views


from ..models import User
from ..serializers.user import UserModelSerializer


## 로그인 및 회원가입 기능에 대해 다룹니다.





## 회원가입, 로그인, 로그아웃 기능에 대해서만 기술합니다.

## 사용자 정보 출력


class UserView(mixins.RetrieveModelMixin, GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserModelSerializer


mvRouter = DefaultRouter()
mvRouter.register('users', UserView)

urlpatterns = [
    path('', include(mvRouter.urls))
]