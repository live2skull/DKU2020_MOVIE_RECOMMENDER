from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views_model.movie import urlpatterns as urlpatterns_movie
from .views_model.recommend import urlpatterns as urlpatterns_recommend


urlpatterns = [
    path('data/', include(urlpatterns_movie)),
    path('recommend/', include(urlpatterns_recommend))
]