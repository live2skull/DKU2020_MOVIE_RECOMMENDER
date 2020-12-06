## ORM 객체 검색을 위한 django_filters.FilterSet 상속 클래스의 집합입니다.
# @package myapp.filtersets

from django_filters import rest_framework as filters
from .models import Movie


## 영화 객체 Movie에 대한 검색 필터입니다.
class MovieFilter(filters.FilterSet):

    title = filters.CharFilter(field_name='name', lookup_expr='icontains')
    genre = filters.NumberFilter(field_name='genres__id', lookup_expr='exact')
    score_gte = filters.NumberFilter(field_name='score', lookup_expr='gte')
    score_lte = filters.NumberFilter(field_name='score', lookup_expr='lte')

    # https://forum.djangoproject.com/t/django-filter-pagination/1556
    # https://stackoverflow.com/questions/50206820/customize-queryset-in-django-filter-modelchoicefilter-select-and-modelmultiple

    class Meta:
        model = Movie
        fields = ('title', 'genre', 'score_gte', 'score_lte', )
        excludes = ('page',)