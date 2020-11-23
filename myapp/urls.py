from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views_model.movie import urlpatterns as urlpatterns_movie
from .views_model.recommend import urlpatterns as urlpatterns_recommend
from .views_model.users import urlpatterns as urlpatterns_user

urlpatterns = [
    path('data/', include(urlpatterns_movie)),
    path('data/', include(urlpatterns_user)),
    path('data/recommends', include(urlpatterns_recommend)),
]