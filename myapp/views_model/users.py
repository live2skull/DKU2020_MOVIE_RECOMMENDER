from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib.auth import authenticate

from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet, GenericViewSet, ViewSet
from rest_framework.exceptions import ValidationError
from rest_framework.authtoken.models import Token

from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import generics, mixins, views

from sentry_sdk import capture_exception

from ..models import User, UserComment
from ..serializers.user import UserModelSerializer, UserActionResSerializer,\
    UserLoginReqSerializer, UserJoinReqSerializer, \
    UserCommentDelReqSerializer, UserCommentEditReqSerializer

import hashlib
from binascii import hexlify

## 로그인 및 회원가입 기능에 대해 다룹니다.
## 회원가입, 로그인, 로그아웃 기능에 대해서만 기술합니다.
## 사용자 정보 출력

from logging import getLogger
logger = getLogger(__name__)


## https://sss20-02.tistory.com/66
## https://ssungkang.tistory.com/entry/Django-APIView-Mixins-generics-APIView-ViewSet%EC%9D%84-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90



class UserLoginActionView(APIView):

    def post(self, request: Request):
        req_serializer = UserLoginReqSerializer(data=request.data)

        try:
            result = req_serializer.is_valid(raise_exception=True)
        except ValidationError as err:
            res_serializer = UserActionResSerializer(
                data={'result': False, 'error_message': "\n".join(err.detail)}
            )
            res_serializer.is_valid()
            return Response(res_serializer.data)

        req_data = req_serializer.data

        try:

            ## 일치하는 사용자를 찾았다면, 로그인 처리합니다.
            user = User.objects.get(email=req_data['email'])
            if not user.check_password(req_data['password']):
                raise User.DoesNotExist()

            token, created = Token.objects.get_or_create(user=user)

            res_serializer = UserActionResSerializer(
                data={'result': True, 'auth_token' : token.key}
            )
            res_serializer.is_valid()
            return Response(res_serializer.data)


        except User.DoesNotExist as ex:
            res_serializer = UserActionResSerializer(
                data={'result': False, 'error_message': "아이디 또는 비밀번호 오류입니다."}
            )
            res_serializer.is_valid()

        except Exception as err:
            capture_exception(err)
            res_serializer = UserActionResSerializer(
                data={'result': False, 'error_message': "알 수 없는 오류입니다."}
            )
            res_serializer.is_valid()
            return Response(res_serializer.data)


class UserJoinActionView(APIView):


    def post(self, request: Request):
        req_serializer = UserJoinReqSerializer(data=request.data)

        ## 잘못된 필드가 있을 경우 ValidationError 가 raise됩니다.
        try:
            result = req_serializer.is_valid(raise_exception=True)
        except ValidationError as err:
            res_serializer = UserActionResSerializer(
                data={'result' : False, 'error_message' : "\n".join(err.detail)}
            )
            res_serializer.is_valid()
            return Response(res_serializer.data)

        req_data = req_serializer.data

        ## 회원가입 후, 로그인 처리합니다.
        ## 해당 메서드를 실행하여야 비밀번호가 암호화됩니다.
        user = User.objects.create_user(
            email=req_data['email'], username=req_data['nickname'],
            password=(req_data['password'])
        )
        logger.debug("user created : %s" % user)

        token = Token.objects.create(user=user)
        logger.debug("token created : %s" % token)


        res_serializer = UserActionResSerializer(
            data={'result': True, 'auth_token' : token.key}
        )
        res_serializer.is_valid()
        return Response(res_serializer.data)


"""
APIView 는 최소한의 코드만 구현되어 있습니다.
인증 등을 제외한 나머지 기능은 직접 구현합니다.
"""

class UserLogoutActionView(APIView):

    permission_classes = (IsAuthenticated, )

    def post(self, request: Request):
        token = request.auth # type: Token
        token.delete()

        res_serializer = UserActionResSerializer(
            data={'result': True}
        )
        res_serializer.is_valid()
        return Response(res_serializer.data)


class UserCommentEditActionView(APIView):

    permission_classes = (IsAuthenticated,)

    def post(self, request: Request):
        req_serializer = UserCommentEditReqSerializer(data=request.data)

        try:
            result = req_serializer.is_valid(raise_exception=True)
        except ValidationError as err:
            res_serializer = UserActionResSerializer(
                data={'result': False, 'error_message': "\n".join(err.detail)}
            )
            res_serializer.is_valid()
            return Response(res_serializer.data)

        req_data = req_serializer.data

        ## 코멘트가 없었다면 생성되고, 그렇지 않으면 수정됩니다.
        comment, updated = UserComment.objects.update_or_create(
            user=request.user, movie_id=req_data['movie_id'],
            defaults={
                'score' : req_data['score'], 'body' : req_data['body']
            }
        )

        res_serializer = UserActionResSerializer(
            data={'result': True}
        )
        res_serializer.is_valid()
        return Response(res_serializer.data)


class UserCommentDeleteActionView(APIView):

    permission_classes = (IsAuthenticated,)

    def post(self, request: Request):

        req_serializer = UserCommentDelReqSerializer(data=request.data)

        try:
            result = req_serializer.is_valid(raise_exception=True)
        except ValidationError as err:
            res_serializer = UserActionResSerializer(
                data={'result' : False, 'error_message' : "\n".join(err.detail)}
            )
            res_serializer.is_valid()
            return Response(res_serializer.data)


        req_data = req_serializer.data

        ## 사용자 계정으로 삭제 시도
        ## 해당 코멘트가 없다면 삭제되지 않지만, 별도의 추가 작업을 일어나지 않습니다.
        UserComment.objects.filter(user=request.user, movie_id=req_data['movie_id']).delete()
        res_serializer = UserActionResSerializer(
            data={'result': True}
        )
        res_serializer.is_valid()
        return Response(res_serializer.data)


class UserMyInfoView(APIView):

    permission_classes = (IsAuthenticated,)

    def get(self, request: Request):
        serializer = UserModelSerializer(request.user, many=False)
        return Response(serializer.data)


class UserView(mixins.RetrieveModelMixin, GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserModelSerializer

    ## 여기서 Action을 사용한다면, PK가 필요하게 됩니다.



## https://sss20-02.tistory.com/66

mvRouter = DefaultRouter()
mvRouter.register('users', UserView)

urlpatters_action = [
    path('myinfo', UserMyInfoView.as_view()),
    path('login', UserLoginActionView.as_view()),
    path('logout', UserLogoutActionView.as_view()),
    path('join', UserJoinActionView.as_view()),
    path('edit_comment', UserCommentEditActionView.as_view()),
    path('delete_comment', UserCommentDeleteActionView.as_view()),
]

urlpatterns = [
    ## 이렇게 하면 URL 우선순위에 의해 해당 요청을 먼저 확인할 수 있습니다.
    path('users/', include(urlpatters_action)),
    path('', include(mvRouter.urls)),
]