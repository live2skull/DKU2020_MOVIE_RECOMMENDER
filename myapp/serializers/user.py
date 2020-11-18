from rest_framework.serializers import ModelSerializer
from rest_framework.fields import CharField, IntegerField, BooleanField, DecimalField

from django.db.models.aggregates import Avg

from ..models import User, UserComment

class UserCommentModelSerializer(ModelSerializer):

    class Meta:
        model = UserComment
        fields = '__all__'


class UserModelSerializer(ModelSerializer):

    comments = UserCommentModelSerializer(many=True)

    class Meta:
        model = User
        fields = '__all__'

