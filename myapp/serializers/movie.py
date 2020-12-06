## 영화 정보 (/data/movies) 요청에 관한 serializer 클래스의 집합입니다.
# @package myapp.serializers.movie

from rest_framework.serializers import ModelSerializer
from rest_framework.fields import CharField, IntegerField, BooleanField, DecimalField
from django.db.models.aggregates import Avg
from ..models import Movie, MovieUserComment, Actor, Genre

## Actor ORM 객체 Serializer입니다.
class ActorModelSerializer(ModelSerializer):
    class Meta:
        model = Actor
        fields = '__all__'

## Genre ORM 객체 Serializer입니다.
class GenreModelSerializer(ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


## Movie ORM 객체 Serializer입니다.
class MovieModelSerializer(ModelSerializer):

    actors = ActorModelSerializer(many=True, read_only=True)
    genres = GenreModelSerializer(many=True, read_only=True)

    score = DecimalField(max_digits=4, decimal_places=2)

    def to_representation(self, instance):
        d = super().to_representation(instance) # type: dict
        return d

    class Meta:
        model = Movie
        fields = '__all__'


### ForeignKey 필드를 별도로 serializer에 작성하지 않으면 해당 키의 primary 키가 key_id 가 아닌 key로 출력됩니다.

## MovieUserCoimment ORM 객체 Serializer입니다.
class MovieUserCommentModelSerializer(ModelSerializer):

    def to_representation(self, instance):
        data = super().to_representation(instance)  # type: dict

        ## 임의로 데이터 서식 변경 - movie => movie_id
        ## movie 로 쓸 경우 object, movies 로 쓸 경우 list에 object 통일성 유지.
        movie_id = data['movie'] # type: int
        del data['movie']
        data.setdefault('movie_id', movie_id)

        return data

    class Meta:
        model = MovieUserComment
        fields = '__all__'