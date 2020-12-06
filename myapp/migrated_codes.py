## 데이터베이스 ORM 객체 변경 간 사용된 코드입니다.
# @package myapp.migrated_codes
# @warning: 더 이상 사용되지 않습니다.


from django.db.models.expressions import F
from myapp.models import MovieUser
from django.db.models.aggregates import Avg

## 외부 사용자의 작성한 모든 리뷰에 대한 평점을 저장합니다.
def add_movieuser_avg_score():
    for movieUser in MovieUser.objects.filter(score_avg__isnull=True):
        movieUser.score_avg = movieUser.comments.aggregate(avg=Avg('score'))['avg']
        movieUser.save()