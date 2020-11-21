from rest_framework.serializers import ModelSerializer
from rest_framework.fields import CharField, IntegerField, BooleanField, DecimalField

from django.db.models.aggregates import Avg

from ..models import Movie, MovieUserComment, Actor, Genre

class ActorModelSerializer(ModelSerializer):
    class Meta:
        model = Actor
        fields = '__all__'



class GenreModelSerializer(ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class MovieModelSerializer(ModelSerializer):

    actors = ActorModelSerializer(many=True, read_only=True)
    genres = GenreModelSerializer(many=True, read_only=True)

    score = DecimalField(max_digits=4, decimal_places=2)

    def to_representation(self, instance):
        d = super().to_representation(instance) # type: dict

        # assert isinstance(instance, Movie)
        # score_avg = instance.comments_movie.aggregate(avg=Avg('score'))['avg']
        # d.setdefault("score_avg", score_avg)

        ## 평균 평점 정보를 수집합니다. (average_score)
        return d

    class Meta:
        model = Movie
        fields = '__all__'


## ForeignKey 필드를 별도로 serializer에 작성하지 않으면 해당 키의 primary 키가 key_id 가 아닌 key로 출력됩니다.

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