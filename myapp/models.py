from datetime import date

from django.db.models import Model, CASCADE
from django.db.models import ForeignKey, OneToOneField
from django.db.models import \
    CharField, SmallIntegerField, IntegerField, BigAutoField, TextField, \
    BinaryField, DecimalField, DateTimeField, DateField, AutoField, ManyToManyField

MAX_STR_LEN = 100


class Genre(Model):
    id = AutoField(primary_key=True, auto_created=True, editable=False)
    name = CharField(null=False, max_length=30)


class Movie(Model):
    """
    영화 정보입니다.
    """

    id = BigAutoField(primary_key=True, auto_created=True, editable=False)
    name = CharField(null=False, max_length=MAX_STR_LEN)
    opened_at = DateField(null=True)
    genres = ManyToManyField('Genre')
    thumb_url = CharField(null=True, max_length=256) # 복잡한 URL 고려
    img_url = CharField(null=True, max_length=256) # 복잡한 URL 고려
    description = TextField(null=True)


class MovieUser(Model):
    """
    외부 영화 사이트 (네이버 영화) 에서 파싱된 사용자 정보입니다.
    """
    id = CharField(primary_key=True, max_length=MAX_STR_LEN)


class MovieUserComment(Model):
    id = BigAutoField(primary_key=True, auto_created=True, editable=False)
    movie_user_id = ForeignKey(MovieUser,
                         null=False, related_name='comments_movieuser', on_delete=CASCADE)
    movie_id = ForeignKey(Movie,
                          null=False, related_name='comments_movieuser', on_delete=1)
    score = IntegerField(null=False)
    body = TextField(null=True)


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
                         null=False, related_name='comments_user', on_delete=CASCADE)
    movie_id = ForeignKey(Movie,
                          null=False, related_name='comments_user', on_delete=CASCADE)
    score = IntegerField(null=False)
    body = TextField(null=True)