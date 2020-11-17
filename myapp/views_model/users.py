from django.urls import path, include
from rest_framework.routers import DefaultRouter

from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework import filters

from django_filters import rest_framework as filters

from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response

from ..models import User



## 로그인 및 회원가입 기능에 대해 다룹니다.



## 회원가입, 로그인, 로그아웃 기능에 대해서만 기술합니다.