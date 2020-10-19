import warnings
from typing import Generator
from .NaverMovieParser import NaverMovieParser
from .NaverMovieRequester import NaverMovieRequester

from .raw_models import RMovie, RMovieUserComment
from .models import Movie, Genre, MovieUserComment, MovieParseHistory


class NaverMovieClient:

    requester = None # type: NaverMovieRequester
    parser = None # type: NaverMovieParser

    def __init__(self):
        self.requester = NaverMovieRequester()
        self.parser = NaverMovieParser()


    def collect_movie_info(self, movie_id: int) -> Movie:
        '''
        영화 정보를 수집합니다.
        :param movie_id: 파싱할 영화 아이디입니다.
        :return:
        '''

        raw = self.requester.request_movie_info(movie_id) # type: str
        if raw.find("영화 코드값 오류입니다.") == -1:
            return None

        robj = self.parser.parse_movie_info(raw) # type: RMovie

        ## 포스터 주소는 별도의 요청이 필요함.
        poster_url = self.parser.parse_movie_poster_url(
            self.requester.request_movie_poster_url(movie_id)
        )

        genres = []
        ## 장르 생성
        for genre in robj.genres:
            _id = genre[0]
            _name = genre[1]
            genres.append(
                Genre.objects.get_or_create(id=_id, defaults={'name' : _name})[0]
            )

        obj, created = Movie.objects.update_or_create(id=movie_id, defaults={
            'name' : robj.name,
            'opened_at' : robj.opened_at,
            'thumb_url' : robj.thumb_url,
            'description' : robj.description,

            'img_url': poster_url,
        })
        
        ## ManyToMany 필드 처리
        ### 리스트 하나씩 확인하여야 하며, 추가된 것 / 제거된 것에 대한 필터링이 필요함.
        ### 현재는 해당 데이터가 변경될 가능성은 없으므로, 새로 생성됬을 때 추가함.
        for genre in genres:
            ## TODO: ManyToMany 자동 저장 가능?
            obj.genres.add(genre)

        obj.save()
        return obj


    def collect_recommends_from_movie_page(self, movie_id: int) -> Generator:
        """
        각 영화 페이지에서 평점 정보를 수집합니다.
        :param movie_id:
        :return:
        """

        count = 0

        for raw in self.requester.request_movie_recommends_until_end(movie_id=movie_id, start_page=1):
            for robj in self.parser.parse_recommends_from_movie_page(raw=raw): # type: RMovieUserComment
        
                ## 영화를 먼저 파싱한 상태라고 가정합니다.
                obj, created = MovieUserComment.objects.update_or_create(
                    id=robj.id, movie_id=robj.movie_id,
                    defaults={
                        "score" : robj.score,
                        "body" : robj.body
                    }
                )
                count += 1
                yield obj

        if count == 0:
            yield from []


    ## unused
    def collect_recommends_from_user_page(self, user_id: int) -> Generator:
        """
        사용자 페이지에서 평점 정보를 수집합니다.
        :param user_id:
        :return:
        """
        warnings.warn("user_id로 데이터 추출 불가. (이전 코멘트 id에 대한 연속적인 정보만 확인 가능)")
        count = 0

        for raw in self.requester.request_user_recommends_until_end(user_id=user_id, start_page=1):
            for robj in self.parser.parse_recommends_from_user_page(raw=raw): # type: RMovieUserComment

                ## TODO: 영화가 등록되어 있지 않은 경우 오류 발생. 따라서, 영화 정보를 먼저 파싱하여야 함.
                obj, created = MovieUserComment.objects.update_or_create(
                    id=robj.id, movie_id=robj.movie_id, # movie_user_id=user_id, -- 사용자 구분 불가능
                    defaults={
                        "score" : robj.score,
                        "body" : robj.body
                    }
                )
                count += 1
                yield obj

        if count == 0:
            yield from []


    def process_movie_info(self, start_movie_id:int, end_movie_id: int,
                           process_recommends:bool=True, ignore_hitted_movie:bool=True):
        """

        :param start_movie_id:
        :param end_movie_id:
        :param process_recommends:
        :param ignore_hitted_movie:
        :return:
        """

        for movie_id in range(start_movie_id, end_movie_id):

            obj, created = MovieParseHistory.objects.get_or_create(
                id=movie_id
            )

            if created is False and ignore_hitted_movie:
                continue

            movie = self.collect_movie_info(movie_id)

            obj.result = 0 if movie is None else 1
            obj.save()
            
            ## 여기서 바로 평점정보 확인
            if movie is not None and process_recommends:
                pass
