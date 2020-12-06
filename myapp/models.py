## 데이터베이스 ORM 객체로 django.db.models.Model 상속 클래스의 집합입니다.
# @package myapp.models

from datetime import date
from typing import Tuple, List
from django.contrib.auth.models import User
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

## mysql CharField 의 최대 문자열 크기입니다.
MAX_STR_LEN = 100


## 장르 ORM 객체입니다.
class Genre(Model):
    ## primary_key
    id = AutoField(primary_key=True, editable=False)
    
    name = CharField(null=False, max_length=30)


## 출연자 ORM 객체입니다.
class Actor(Model):
    ## primary_key
    id = IntegerField(primary_key=True, editable=False)
    
    name = CharField(null=False, max_length=30)


## 영화 ORM 객체입니다.
class Movie(Model):

    ## primary_key
    id = IntegerField(primary_key=True, editable=False)
    ## 이름
    name = CharField(null=False, max_length=MAX_STR_LEN)
    ## 개봉일
    opened_at = DateField(null=True)

    ## m2m for Genre
    genres = ManyToManyField('Genre')
    ## m2m for Actor
    actors = ManyToManyField("Actor")

    ## 미리보기 이미지 URL
    thumb_url = CharField(null=True, max_length=256)
    ## 이미지 URL
    img_url = CharField(null=True, max_length=256)
    ## 영화소개
    description = TextField(null=True)

    ## 평균 평점. 소숫점 2자리까지 저장합니다.
    score = DecimalField(null=True, max_digits=4, decimal_places=2)

    ## 전체 영화의 평균 평점을 업데이트합니다.
    # @param force_update: False 일 경우, 평점이 존재하지 않는(null) 객체에 대해서만 업데이트합니다.
    #   기본값은 False 입니다.
    @classmethod
    def update_scores(cls, force_update:bool=False):
        objs = cls.objects.all() if force_update else cls.objects.filter(score__isnull=True) # type: List['Movie']
        logger.debug('update_scores() : %s cnt' % len(objs))

        for obj in objs:
            obj.update_score()

    ## 현재 영화 객체의 평균 평점을 업데이트합니다.
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


## 외부 영화 서비스 (네이버 영화) 에서 파싱된 사용자 ORM 객체입니다.
class MovieUser(Model):

    ## primary_key
    id = BigAutoField(primary_key=True)
    ## 사용자가 작성한 전체 평가의 평균 점수입니다.
    score_avg = DecimalField(null=True, max_digits=4, decimal_places=2)

    ## 영화 코멘트 리스트를 가져올 수 있는 익명 데이터입니다.
    # NaverMovieClient.process_recommend_info
    # 사용자 지정 과정에서 사용됩니다.
    @property
    def track_comment(self) -> 'MovieUserComment':
        return self.comments.all()[0]


## 외부 영화 서비스 (네이버 영화) 에서 파싱된 사용자 리뷰 ORM 객체입니다.
class MovieUserComment(Model):
    
    ## primary_key
    id = IntegerField(primary_key=True,editable=False)
    
    ## 작성 대상 외부 사용자
    user = ForeignKey(MovieUser, null=True, related_name='comments', on_delete=CASCADE)

    ## 작성 대상 영화
    # 필드 index가 적용되어 있습니다.
    movie = ForeignKey(Movie, null=False, related_name='comments_movie', on_delete=1)

    ## 점수
    # 필드 index가 적용되어 있습니다.
    score = IntegerField(null=False)

    ## 상세내용
    body = TextField(null=True)

    ## 스포일러 여부
    is_spoiler = BooleanField(null=False, default=False)

    ## 파싱된 임시 객체 RMovieUserComment 로부터 데이터를 저장하고 ORM 객체를 생성합니다.
    # 이미 해당 정보로 작성된 리뷰가 있다면 업데이트됩니다.
    #
    # @param movie_id: 작성 대상 영화 id입니다.
    # @param robj: 파싱된 RMovieUserCommnent 객체입니다.
    # @return: List[MovieUserComment, bool] 생성된 객체와, 업데이트 여부입니다.
    @classmethod
    def save_from_rmodel(cls, movie_id: int, robj: RMovieUserComment) -> Tuple['MovieUserComment', bool]:
        obj, updated = cls.objects.update_or_create(id=robj.id, movie_id=movie_id, defaults={
            "score" : robj.score, "body" : robj.body,
            "is_spoiler" : robj.is_spoiler
        })

        return obj, updated

    class Meta:
        # 참고: unique_together 또는 UniqueConstraint 옵션을 사용하여 여러 필드 쌍을 constraint 하게 묶을 수 있음.
        indexes = [
            Index(fields=['movie']),
            Index(fields=['score']),
            Index(fields=['movie', 'score'])
        ]



## 사용자 리뷰 / 평점 ORM 객체입니다.
class UserComment(Model):

    ## primary_key
    id = BigAutoField(primary_key=True, auto_created=True, editable=False)

    ## 작성 대상 사용자
    user = ForeignKey(User,
                         null=False, related_name='comments', on_delete=CASCADE)
    ## 작성 대상 영화
    movie = ForeignKey(Movie,
                          null=False, related_name='comments_user', on_delete=CASCADE)
    ## 점수
    score = IntegerField(null=False)
    
    ## 상세내용
    body = TextField(null=True)
    