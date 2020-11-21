from abc import ABC


from rest_framework.serializers import ModelSerializer, Serializer
from rest_framework.fields import CharField, IntegerField, BooleanField, DecimalField
from rest_framework.exceptions import ValidationError

from ..models import User, UserComment

class UserCommentModelSerializer(ModelSerializer):

    def to_representation(self, instance):
        data = super().to_representation(instance) # type: dict

        movie_id = data['movie']  # type: int
        del data['movie']
        data.setdefault('movie_id', movie_id)

        return data

    class Meta:
        model = UserComment
        fields = '__all__'


class UserModelSerializer(ModelSerializer):

    comments = UserCommentModelSerializer(many=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)  # type: dict

        username = data['username']  # type: int
        del data['username']
        data.setdefault('nickname', username)

        return data

    class Meta:
        model = User
        # exclude = ('password', 'is_superuser', 'last_login')
        fields = ('id', 'comments', 'username', 'email',)


class UserLoginReqSerializer(Serializer):

    email = CharField(required=True)
    password = CharField(required=True)


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


class UserCommentEditReqSerializer(Serializer):

    movie_id = IntegerField(required=True)
    score = IntegerField(required=True, max_value=10, min_value=0)
    body = CharField(required=False)


class UserCommentDelReqSerializer(Serializer):

    movie_id = IntegerField(required=True)


class UserActionResSerializer(Serializer):

    result = BooleanField(required=True)
    error_message = CharField(required=False, default=None)
    auth_token = CharField(required=False)
