from rest_framework import generics
from django_filters import rest_framework as filters
from rest_framework.request import Request

from .models import Movie
from django.db.models import Avg

# https://forum.djangoproject.com/t/django-filter-pagination/1556
# https://stackoverflow.com/questions/50206820/customize-queryset-in-django-filter-modelchoicefilter-select-and-modelmultiple

'''
특정 평점으로 정렬하게 됩니다.
따라서 입력받은 평점이 있으면, 모든 행의 평점을 전부다 계산해서 반환해야 합니다.
그러기에는 오버헤드가 너무 크겠죠?
따라서 평점을 미리 계산하도록 합니다.
'''



class MovieFilter(filters.FilterSet):



    title = filters.CharFilter(field_name='name', lookup_expr='icontains')
    genre = filters.NumberFilter(field_name='genres__id', lookup_expr='exact')

    # 평점별 검색
    score_gte = filters.NumberFilter(field_name='score', lookup_expr='gte')
    score_lte = filters.NumberFilter(field_name='score', lookup_expr='lte')

    class Meta:
        model = Movie
        fields = ('title', 'genre', 'score_gte', 'score_lte', )
        excludes = ('page',)