from django.db.models.expressions import F
from myapp.models import MovieUser
from django.db.models.aggregates import Avg


def add_movieuser_avg_score():
    for movieUser in MovieUser.objects.filter(score_avg__isnull=True):
        movieUser.score_avg = movieUser.comments.aggregate(avg=Avg('score'))['avg']
        movieUser.save()