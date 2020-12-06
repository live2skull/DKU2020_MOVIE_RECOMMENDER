## 사용자 정보 (/data/users) 요청에 관한 serializer 클래스의 집합입니다.
# @package myapp.serializers.user

from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework.fields import CharField, IntegerField, BooleanField, DecimalField
from rest_framework.exceptions import ValidationError
from ..models import User, UserComment


## UserComment ORM 객체 Serializer입니다.
class UserMyMovieCommentResSerializer(ModelSerializer):

    def to_representation(self, instance: UserComment):
        data = super().to_representation(instance) # type: dict

        movie_id = data['movie']  # type: int
        del data['movie']
        data.setdefault('movie_id', movie_id)

        user_id = data['user']
        del data['user']
        data.setdefault('nickname', instance.user.username)

        return data

    class Meta:
        model = UserComment
        fields = '__all__'


## User ORM 객체 Serializer입니다.
class UserModelSerializer(ModelSerializer):

    comments = UserMyMovieCommentResSerializer(many=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)  # type: dict

        username = data['username']  # type: int
        del data['username']
        data.setdefault('nickname', username)

        return data

    class Meta:
        model = User
        fields = ('id', 'comments', 'username', 'email',)


## 사용자 로그인 Action 요청 Serializer입니다.
class UserLoginReqSerializer(Serializer):

    email = CharField(required=True)
    password = CharField(required=True)


## 사용자 회원가입 Action 요청 Serializer입니다.
class UserJoinReqSerializer(Serializer):

    email = CharField(required=True)
    nickname = CharField(required=True)
    password = CharField(required=True)
    password_confirm = CharField(required=True)

    def is_valid(self, raise_exception=False):
        super().is_valid(raise_exception=True)

        data = self._kwargs['data'] # data

        ## TODO: 이런 정보들을 별도의 validator로 구분할 수 있습니다.

        if User.objects.filter(email=data['email']).exists():
            raise ValidationError("이미 중복된 이메일이 있습니다.")

        if User.objects.filter(username=data['nickname']).exists():
            raise ValidationError("이미 중복된 닉네임이 있습니다.")

        if data['password'] != data['password_confirm']:
            raise ValidationError("비밀번호 확인이 일치하지 않습니다.")

        password_sz = len(data['password']) # type: int
        if not (6 <= password_sz <= 20):
            raise ValidationError("비밀번호는 6자 이상 20자 이하여야 합니다.")

        return True


## 사용자 평가 정보 작성 / 수정 Action 요청 Serializer입니다.
class UserCommentEditReqSerializer(Serializer):

    movie_id = IntegerField(required=True)
    score = IntegerField(required=True, max_value=10, min_value=0)
    body = CharField(required=False)


## 사용자 평가 정보 삭제 Action 요청 Serializer입니다.
class UserCommentDelReqSerializer(Serializer):

    movie_id = IntegerField(required=True)


## 사용자의 Action 에 대한 응답 Serializer입니다.
class UserActionResSerializer(Serializer):

    result = BooleanField(required=True)
    error_message = CharField(required=False, default=None)
    auth_token = CharField(required=False)


### TODO: ModelSerializer를 상속받으면, 해당 기능을 정확히 어떻게 상속하는지? (예: 필드 등)