from django.urls import path, include
from rest_framework.routers import DefaultRouter

from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from django_filters import rest_framework as filters

from rest_framework.permissions import IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response


from ..models import MovieUserComment, Movie
from ..serializers.movie import MovieModelSerializer, MovieUserCommentModelSerializer


## TODO: 최근 영화 정보 표기
## TODO: pagnation 사용 시 result 버킷이 추가됨. 위와 같은 효과를 낼 수 있는 다른 효율적인 방법이 없을지?


class StandardPagnation(PageNumberPagination):
    page_size = 10
    max_page_size = 10
    page_query_param = 'page'



class MovieModelView(ReadOnlyModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieModelSerializer
    pagination_class = StandardPagnation

    ## 사용하지 않을 경우
    # def list(self, request, *args, **kwargs):
    #     raise  NotImplementedError()




class MovieUserCommentView(ListAPIView):
    # queryset -> 고유 id 값이 아닌, 영화 id 값을 넣었을 때 해당 값으로 검색해야함.

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


urlpatterns = [
    path('', include(mvRouter.urls)),
    path('comments/<pk>', MovieUserCommentView.as_view()),
    path('comments/<pk>/', MovieUserCommentView.as_view())
    ## ?? 끝 slash 사용불가능 / digit only
]