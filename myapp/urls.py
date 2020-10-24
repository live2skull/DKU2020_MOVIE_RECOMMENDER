from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views_model.movie import urlpatterns as urlpatterns_movie


urlpatterns = [
    path('data/', include(urlpatterns_movie))
]