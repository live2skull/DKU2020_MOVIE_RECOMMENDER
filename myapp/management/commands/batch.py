from django.core.management.base import BaseCommand, CommandParser
from myapp.NaverMovieClient import NaverMovieClient

# NaverMovieClientBatchCommand
class Command(BaseCommand):

    help = "영화 및 추천 정보를 자동으로 수집합니다."

    def add_arguments(self, parser: CommandParser):
        parser.add_argument(
            '--task', type=str, required=True, choices=('movie_current_showing', ),
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

    def handle(self, *args, **options):
        task = options['task']
        process_recommends = options['process_recommends']
        ignore_hitted_movie = options['ignore_hitted_movie']

        client = NaverMovieClient()

        if task == 'movie_current_showing':
            client.process_movie_current_showing(
                process_recommends=process_recommends, ignore_hitted_movie=ignore_hitted_movie
            )




class NaverMovieClientManualCommand(BaseCommand):

    help = "영화 및 추천 정보 수집을 수동으로 지정합니다."

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        pass


## 기존에 몰랐던 내용
# 상속 가능한 클래스 제작 시 반드시 구현할 필요가 없는 함수 : 함수 선언 후 pass 키워드 사용
# 상속 가능한 클래스 제작 시 반드시 구현해야 하는 함수 : 함수 선언 후 raise NotImplementedError("message") 작성
