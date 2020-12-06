## 영화 및 영화에 해당하는 평가 정보를 제공하는 view 클래스의 집합입니다.
# @package myapp.views.movie

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import filters

from django_filters import rest_framework as filters

from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response


from ..models import MovieUserComment, Movie, Genre, UserComment
from ..serializers.movie import MovieModelSerializer, MovieUserCommentModelSerializer, GenreModelSerializer
from ..serializers.user import UserMyMovieCommentResSerializer
from ..filtersets import MovieFilter

from . import StandardPagnation


## 장르 정보를 제공합니다.
class GenreModelView(ReadOnlyModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreModelSerializer
    pagination_class = StandardPagnation


## 영화 정보를 제공합니다.
class MovieModelView(ReadOnlyModelViewSet):
    queryset = Movie.objects.all().order_by('-score').order_by('-opened_at')
    serializer_class = MovieModelSerializer
    pagination_class = StandardPagnation
    filter_backends = (filters.DjangoFilterBackend, )
    filter_class = MovieFilter


## 지정한 영화에 작성된 사용자 평가를 제공합니다.
# URL/<movie_id:int>
# 사용자는 외부에서 추출된 외부 사용자와 본 서비스에 가입된 사용자로 구분됨.
class MovieUserCommentView(ListAPIView):

    serializer_class = UserMyMovieCommentResSerializer
    pagination_class = StandardPagnation

    movie_id = None # type: int

    def get_queryset(self):
        return UserComment.objects.filter(movie_id=self.movie_id)

    def get(self,  request, *args, **kwargs):
        self.movie_id = kwargs['movie_id']
        return super().get(self, request, *args, **kwargs)


## 지정한 영화에 작성된 외부 사용자 평가를 제공합니다.
# URL/<movie_id:int>
# 사용자는 외부에서 추출된 외부 사용자와 본 서비스에 가입된 사용자로 구분됨.
class MovieParsedUserCommentView(ListAPIView):
    serializer_class = MovieUserCommentModelSerializer
    pagination_class = StandardPagnation

    pk = None # type: int

    def get_queryset(self):
        return MovieUserComment.objects.filter(movie_id=self.pk)

    def get(self, request, *args, **kwargs):
        self.pk = kwargs['pk']
        return super().get(self, request, *args, **kwargs)


mvRouter = DefaultRouter()
mvRouter.register('movies', MovieModelView)
mvRouter.register('genres', GenreModelView)


## 구현된 view에 대한 URL 정의입니다.
urlpatterns = [
    path('', include(mvRouter.urls)),
    path('comments/<pk>', MovieParsedUserCommentView.as_view()),
    path('user_comments/<int:movie_id>', MovieUserCommentView.as_view()),
    ### ?? 끝 slash 사용불가능 / digit only
]

### TODO: 최근 영화 정보 표기
### TODO: pagnation 사용 시 result 버킷이 추가됨. 위와 같은 효과를 낼 수 있는 다른 효율적인 방법이 없을지?
