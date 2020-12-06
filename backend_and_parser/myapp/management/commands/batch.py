## 영화 수집을 위한 구현입니다.
# @package myapp.management.commands.batch

from django.core.management.base import BaseCommand, CommandParser
from django.core.management.base import CommandError

from myapp.NaverMovieClient import NaverMovieClient
from myapp.models import MovieUser, Movie
from typing import Iterator


## (batch) 영화 수집 자동화를 위한 기능입니다.
# --task movie_current_showing : 현재 상영 중인 영화와 평가 정보를 수집
# --task movie_from_recommends : 평가 정보가 입력된 영화와 해당 평가 정보를 추가 수집
# --task recommend_info : 수집된 평가 정보에 대해 고유 사용자를 지정
class Command(BaseCommand):

    help = "영화 및 추천 정보를 자동으로 수집합니다."

    def add_arguments(self, parser: CommandParser):
        parser.add_argument(
            '--task', type=str, required=True,
            choices=('movie_current_showing', 'movie_from_recommends', 'recommend_info',),
            help='실행할 작업을 지정합니다.'
        )
        parser.add_argument(
            '--process-recommends', type=bool, required=False, default=True,
            help='영화 정보를 수집할 경우, 추천 정보까지 같이 수집할지에 대한 여부입니다. 기본값은 True 입니다.'
        )

        parser.add_argument(
            '--ignore-hitted-movie', type=bool, required=False, default=False,
            help='영화 정보를 수집할 경우, 이미 수집된 영화의 경우 업데이트를 무시할지에 대한 여부입니다. 기본값은 False 입니다.'
        )

        parser.add_argument(
            '--recommend-count', type=int, required=False, default=-1,
            help='recommend_info 추천 정보 처리 과정에서 처리할 작업 갯수입니다. 제한을 두지 않으려면 -1 입니다. 기본값은 -1 입니다.'

        )


    def handle(self, *args, **options):
        task = options['task']
        process_recommends = options['process_recommends']
        ignore_hitted_movie = options['ignore_hitted_movie']

        recommend_count = options['recommend_count']

        client = NaverMovieClient()

        if task == 'movie_current_showing':
            generator = client.process_movie_current_showing(
                process_recommends=process_recommends, ignore_hitted_movie=ignore_hitted_movie
            ) # type: Iterator[Movie]
            for movie in generator:
                print('영화 처리 : id=%s' % movie.id)

        elif task == 'recommend_info':
            generator = client.process_recommend_info(count=recommend_count) # type: Iterator[MovieUser]
            for movieUser in generator: # type: MovieUser
                print('사용자 처리 : id=%s' % movieUser.id)

        elif task == 'movie_from_recommends':
            generator = client.process_movie_from_recommends(count=recommend_count) # type: Iterator[Movie]
            for movie in generator:
                print('영화 처리 : id=%s' % movie.id)

        else:
            raise CommandError("일치하는 명렁어가 없습니다. 'manage.py task --help' 로 명령을 확인하세요.")


### 기존에 몰랐던 내용
### 상속 가능한 클래스 제작 시 반드시 구현할 필요가 없는 함수 : 함수 선언 후 pass 키워드 사용
### 상속 가능한 클래스 제작 시 반드시 구현해야 하는 함수 : 함수 선언 후 raise NotImplementedError("message") 작성
