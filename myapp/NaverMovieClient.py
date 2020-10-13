from .NaverMovieParser import NaverMovieParser
from .NaverMovieRequester import NaverMovieRequester

from .raw_models import RMovie
from .models import Movie, Genre


class NaverMovieClient:

    requester = None # type: NaverMovieRequester
    parser = None # type: NaverMovieParser

    def __init__(self):
        self.requester = NaverMovieRequester()
        self.parser = NaverMovieParser()


    def collect_movie_info(self, movie_id: int) -> Movie:
        '''

        :param movie_id: 파싱할 영화 아이디입니다.
        :return:
        '''

        raw = self.requester.request_movie_info(movie_id) # type: str
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
            obj.genres.add(genre)

        obj.save()
        return obj