## 서비스 API의 URL을 정의합니다.
# @package myapp.urls

from django.urls import path, include
from .views.movie import urlpatterns as urlpatterns_movie
from .views.recommend import urlpatterns as urlpatterns_recommend
from .views.users import urlpatterns as urlpatterns_user

urlpatterns = [
    path('data/', include(urlpatterns_movie)),
    path('data/', include(urlpatterns_user)),
    path('data/recommends', include(urlpatterns_recommend)),
]