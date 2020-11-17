from datetime import date

from typing import Tuple, List

from django.db.models import Model, CASCADE
from django.db.models import ForeignKey, OneToOneField
from django.db.models import \
    CharField, SmallIntegerField, IntegerField, BigAutoField, TextField, \
    BinaryField, DecimalField, DateTimeField, DateField, AutoField, ManyToManyField, BooleanField
from django.db.models import Index

from django.db.models.aggregates import Avg

from .raw_models import RMovieUserComment

from logging import getLogger

logger = getLogger(__name__)

MAX_STR_LEN = 100


class Genre(Model):
    id = AutoField(primary_key=True, editable=False)
    name = CharField(null=False, max_length=30)


class Actor(Model):
    id = IntegerField(primary_key=True, editable=False)
    name = CharField(null=False, max_length=30)


class Movie(Model):
    """
    영화 정보입니다.
    """

    id = IntegerField(primary_key=True, editable=False)
    name = CharField(null=False, max_length=MAX_STR_LEN)
    opened_at = DateField(null=True)

    genres = ManyToManyField('Genre')
    actors = ManyToManyField("Actor")

    thumb_url = CharField(null=True, max_length=256) # 복잡한 URL 고려
    img_url = CharField(null=True, max_length=256) # 복잡한 URL 고려
    description = TextField(null=True)

    score = DecimalField(null=True, max_digits=4, decimal_places=2) # 소숫점 두자리수까지 허용합니다.

    @classmethod
    def update_scores(cls):
        objs = cls.objects.filter(score__isnull=True) # type: List['Movie']
        logger.debug('update_scores() : %s cnt' % len(objs))

        for obj in objs:
            obj.update_score()


    def update_score(self):
        result = MovieUserComment.objects.filter(movie_id=self.id) \
            .annotate(score_avg=Avg("score")) \
            .values('score_avg')

        score = result[0]['score_avg'] if len(result) else None
        logger.debug('update_score %s (%s) = %s' % (self.id, self.name, score))
        self.score = score
        self.save()


    def __str__(self):
        return "Movie: %s - %s" % (self.id, self.name)


class MovieParseHistory(Model):
    id = IntegerField(primary_key=True, editable=False)
    result = IntegerField(null=False)

    updated_at = DateTimeField(auto_created=True, auto_now_add=True)

## 사용자 정보 삭제 - 익명 사용자로 대체함

class MovieUser(Model):
    """
    외부 영화 사이트 (네이버 영화) 에서 파싱된 사용자 정보입니다.
    """
    # 내부 고유 값
    id = BigAutoField(primary_key=True)

    @property
    def track_comment(self) -> 'MovieUserComment':
        """
        영화 코멘트 리스트를 가져올 수 있는 익명 데이터입니다.
        """
        return self.comments.all()[0]


class MovieUserComment(Model):
    id = IntegerField(primary_key=True,editable=False)
    user = ForeignKey(MovieUser, null=True, related_name='comments', on_delete=CASCADE)
    movie = ForeignKey(Movie,
                          null=False, related_name='comments_movie', on_delete=1)
    score = IntegerField(null=False)
    body = TextField(null=True)

    is_spoiler = BooleanField(null=False, default=False)


    @classmethod
    def save_from_rmodel(cls, movie_id: int, robj: RMovieUserComment) -> Tuple['MovieUserComment', bool]:
        obj, updated = cls.objects.update_or_create(id=robj.id, movie_id=movie_id, defaults={
            "score" : robj.score, "body" : robj.body,
            "is_spoiler" : robj.is_spoiler
        })

        return obj, updated

    class Meta:
        ## 최적화를 위한 인덱싱 추가
        indexes = [
            Index(fields=['movie'])
        ]
        ## TODO: unique_together 또는 UniqueConstraint 옵션을 사용하여 여러 필드 쌍을 constraint 하게 묶을 수 있음.


#### ---- 실 서비스 사용자 데이터 ----

class User(Model):
    """
    사용자 정보입니다.
    """

    id = BigAutoField(primary_key=True, auto_created=True, editable=False)
    email = CharField(unique=True, null=False, max_length=MAX_STR_LEN)
    password = CharField(null=False, max_length=MAX_STR_LEN)
    nickname = CharField(null=False, unique=True, max_length=MAX_STR_LEN)


class UserComment(Model):
    """
    사용자 리뷰 / 평점 정보입니다.
    """
    id = BigAutoField(primary_key=True, auto_created=True, editable=False)
    user = ForeignKey(User,
                         null=False, related_name='comments', on_delete=CASCADE)
    movie = ForeignKey(Movie,
                          null=False, related_name='comments_user', on_delete=CASCADE)
    score = IntegerField(null=False)
    body = TextField(null=True)