from datetime import date

from typing import Tuple

from django.db.models import Model, CASCADE
from django.db.models import ForeignKey, OneToOneField
from django.db.models import \
    CharField, SmallIntegerField, IntegerField, BigAutoField, TextField, \
    BinaryField, DecimalField, DateTimeField, DateField, AutoField, ManyToManyField, BooleanField

from .raw_models import RMovieUserComment

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
    user_id = ForeignKey(User,
                         null=False, related_name='comments', on_delete=CASCADE)
    movie_id = ForeignKey(Movie,
                          null=False, related_name='comments_user', on_delete=CASCADE)
    score = IntegerField(null=False)
    body = TextField(null=True)