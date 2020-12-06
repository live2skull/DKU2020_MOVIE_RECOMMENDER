## 데이터 파싱 과정으로 파싱이 완료된 임시 데이터 객체입니다.
# @package myapp.raw_models

from datetime import date
from typing import Tuple


## 영화 임시 객체입니다.
class RMovie:
    ## 이름
    name = None # type : str
    ## 개봉일 
    opened_at = None # type: date
    ## 장르
    genres = None # type: Tuple[int, str]
    ## 출연자
    actors = None # type: Tuple[int, str]
    ## 미리보기 URL
    thumb_url = None # type: str
    ## 상세정보
    description = None # type: str


## 외부 사용자 리뷰 임시 객체입니다.
class RMovieUserComment:
    ## 고유 id
    id = None # type: int
    ## 영화 id
    movie_id = None # type: int
    ## 점수
    score = None # type: int
    ## 리뷰내용
    body = None # type: str
    ## 스포일러 여부
    is_spoiler = None # type: bool