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

class MovieUserCommentModelSerializer(ModelSerializer):

    class Meta:
        model = MovieUserComment
        fields = '__all__'