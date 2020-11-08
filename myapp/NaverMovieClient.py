import warnings
from typing import Generator, List
from .NaverMovieParser import NaverMovieParser
from .NaverMovieRequester import NaverMovieRequester

from .raw_models import RMovie, RMovieUserComment
from .models import Movie, Genre, Actor, MovieUserComment, MovieParseHistory, MovieUser

import logging
logger = logging.getLogger(__name__)

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
        if raw.find("영화 코드값 오류입니다.") != -1:
            return None

        robj = self.parser.parse_movie_info(raw) # type: RMovie
        if robj is None:
            return None

        ## 포스터 주소는 별도의 요청이 필요함.
        poster_url = self.parser.parse_movie_poster_url(
            self.requester.request_movie_poster_url(movie_id)
        )

        genres = []
        ## 장르 생성
        for genre in robj.genres:
            _id, _name = genre
            genres.append(
                Genre.objects.get_or_create(id=_id, name=_name)[0]
            )


        actors = []
        ## 배우 생성
        ## TODO: 배우 생성 시 () 이전 데이터를 입력하여야 함. - 배우이름 / 역할로 지정되지 때문임!
        ## 괄호 있는경우 없는경우 구분해서 삽입합니다.
        for actor in robj.actors:
            _id, _name = actor
            actors.append(
                Actor.objects.get_or_create(id=_id, defaults={'name' : _name})[0]
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
            if genre not in obj.genres.all():
                obj.genres.add(genre)

        for actor in actors:
            if actor not in obj.actors.all():
                obj.actors.add(actor)

        obj.save()
        return obj


    def collect_recommends_from_movie_page(self, movie_id: int) -> Generator[MovieUserComment, int, None]:
        """
        각 영화 페이지에서 평점 정보를 수집합니다.
        :param movie_id:
        :return:
        """

        count = 0

        if not Movie.objects.filter(id=movie_id).exists():
            raise ValueError("id=%s 영화는 아직 불러오지 않았습니다." % movie_id)

        movie = Movie.objects.get(id=movie_id) # type: Movie

        for raw in self.requester.request_movie_recommends_until_end(movie_id=movie_id, start_page=1):
            for robj in self.parser.parse_recommends_from_movie_page(raw=raw): # type: RMovieUserComment
        
                ## 영화를 먼저 파싱한 상태라고 가정합니다.
                ## TODO: Model.objects?
                obj, created = MovieUserComment.save_from_rmodel(
                    movie_id=movie_id, robj=robj
                )
                count += 1
                yield obj

        if count == 0:
            yield from []


    def collect_recommends_from_user_page(self, comment_id: int) -> Generator[MovieUserComment, int, None]:
        """
        사용자 페이지에서 평점 정보를 수집합니다.
        :param comment_id:
        :return:
        """

        count = 0

        for raw in self.requester.request_user_recommends_until_end(comment_id=comment_id, start_page=1):
            for robj in self.parser.parse_recommends_from_user_page(raw=raw): # type: RMovieUserComment

                ## 아직 영화 정보가 없다면 저장할 수 없습니다.
                ## 아직 저장되지 않았다면 계속할 수 없습니다.
                if Movie.objects.filter(id=robj.movie_id).exists() and \
                        MovieUserComment.objects.filter(id=robj.id).exists():

                    ## 여기서 저장하지 않습니다!!
                    ## 불러와진 정보를 저장합니다.
                    # obj, created = MovieUserComment.save_from_rmodel(
                    #     movie_id=robj.movie_id, robj=robj
                    # )

                    count += 1
                    yield MovieUserComment.objects.get(id=robj.id)

        if count == 0:
            yield from []


    def collect_movie_id_from_recommends(self, movie_user_id: int) -> Generator[int, int, None]:
        """

        :param movie_user_id: 대상 사용자 id입니다.
        :return: 영화 id 값을 반환합니다.
        """

        count = 0

        movieUser = MovieUser.objects.get(id=movie_user_id) # type: MovieUser

        for raw in self.requester.request_user_recommends_until_end(comment_id=movieUser.track_comment.id, start_page=1):
            for robj in self.parser.parse_recommends_from_user_page(raw=raw): # type: RMovieUserComment

                    count += 1
                    yield robj.movie_id

        if count == 0:
            yield from []


    ### 사용하지 않음
    def process_movie_info(self, start_movie_id:int, end_movie_id: int,
                           process_recommends:bool=True, ignore_hitted_movie:bool=True) :
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
            if movie is None:
                continue


            obj.result = 0 if movie is None else 1
            obj.save()

            ## TODO: 작성 완료

            ## 여기서 바로 평점정보 확인
            if movie is not None and process_recommends:
                pass



    def process_movie_current_showing(self, process_recommends:bool=True, ignore_hitted_movie:bool=True) -> Generator[Movie, int, None]:
        """
        현재 상영영화에 대해 파싱을 진행합니다.

        :param process_recommends: 추천 / 평점 정보 수집 여부입니다. 기본값은 True 입니다.
        :param ignore_hitted_movie: 이미 수집된 영화에 대해 작업 여부를 결정합니다. 기본값은 True 입니다.
        :return:
        """
        ## TODO: logging!!

        count = 0

        for movie_id in self.parser.parse_showing_movie_list(
                self.requester.request_showing_movie_list()
        ):
            if ignore_hitted_movie and Movie.objects.filter(id=movie_id).exists():
                continue

            movie = self.collect_movie_info(movie_id) # type: Movie
            if movie is None:
                continue


            logger.debug("movie : %s" % movie.id)

            if process_recommends:
                for recommend in self.collect_recommends_from_movie_page(movie_id):
                    logger.debug("recommend : %s" % recommend.id)

            yield movie
            count += 1

        if count == 0:
            yield from []


    def process_movie_from_recommends(self, count: bool, process_recommends:bool=True) -> Generator[Movie, int, None]:
        """
        현재 저장된 영화사용자에 대해 다른 영화가 파싱되어있는지 확인하고, 없다면 진행합니다.

        :param count: 반복할 횟수를 지정합니다. -1 을 지정할 경우, 더이상 일치하는 데이터가 없을 때 까지 계속합니다.
        :param process_recommends: 추천 / 평점 정보 수집 여부입니다. 기본값은 True 입니다.
        :return:
        """
        _count = 0

        for movieUser in MovieUser.objects.all():
            for movie_id in self.collect_movie_id_from_recommends(movieUser.id):

                if Movie.objects.filter(id=movie_id).exists():
                    continue

                movie = self.collect_movie_info(movie_id) # type: Movie
                if movie is None:
                    continue

                logger.debug("movie : %s" % movie.id)

                if process_recommends:
                    for recommend in self.collect_recommends_from_movie_page(movie_id):
                        logger.debug("recommend : %s" % recommend.id)

                yield movie

                _count += 1
                if count != -1 and _count >= count:
                    return

        if _count == 0:
            yield from []


    def process_recommend_info(self, count) -> Generator[MovieUser, int, None]:
        """
        :param count: 반복할 횟수를 지정합니다. -1 을 지정할 경우, 더이상 일치하는 데이터가 없을 때 까지 계속합니다.

        :return: 각 코멘트에 대해 지정된 MovieUser 제네레이터입니다.
        """

        _count = 0

        while MovieUserComment.objects.filter(user_id__isnull=True).exists():
            comments = MovieUserComment.objects.filter(user_id__isnull=True)

            for comment in comments: # type: MovieUserComment
                ## 아직 user가 지정되지 않은 코멘트입니다.

                logger.debug("comment : %s" % comment.id)
                # 1. 해당 코멘트에 해당하는 모든 코멘트를 불러옵니다.
                
                # 이 때, collect_recommends_from_user_page 함수를 통해
                # 저장되지 않았던 영화 정보는 사전에 이미 저장됩니다.
                _comments = list(self.collect_recommends_from_user_page(comment_id=comment.id)) # type: List[MovieUserComment]

                # 이미 저장되어 있는 user 정보 추출
                master_user_id = 0

                # 이미 user 정보가 지정되어 있는지 확인합니다.
                for _comment in _comments: # type: MovieUserComment
                    if _comment.user is not None:
                        master_user_id += _comment.user_id
                        break

                # 이미 저장되어 있는 user 정보가 있는 경우
                if master_user_id != 0:
                    # 현재 진행중인 코멘트에 대해 사용자 저장
                    comment.user_id = master_user_id
                    comment.save()

                    # 불러와진 사용자가 지정되지 않은 다른 코멘트에 대해 저장
                    for _comment in _comments: # type: MovieUserComment
                        if _comment.user is None:
                            _comment.user_id = master_user_id
                            _comment.save()

                    # 지정된 MovieUser
                    yield MovieUser.objects.get(id=master_user_id)


                # 그렇지 않은 경우
                # 새로운 MovieUser를 생성하고, 모든 코멘트에 대해 저장합니다.
                else:
                    movieUser = MovieUser.objects.create()
                    # 현재 진행중인 코멘트에 대해 사용자 저장
                    comment.user = movieUser
                    comment.save()

                    # 불러와진 다른 코멘트에 대해 저장
                    for _comment in _comments:
                        _comment.user = movieUser
                        _comment.save()

                    yield movieUser


            _count += 1
            if count != -1 and _count >= count:
                break


        if _count == 0:
            yield from []