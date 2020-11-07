from django.core.management.base import BaseCommand, CommandParser
from myapp.NaverMovieClient import NaverMovieClient

# NaverMovieClientBatchCommand

class Command(BaseCommand):

    help = "영화 및 추천 정보 수집을 수동으로 지정합니다."

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        pass


## 기존에 몰랐던 내용
# 상속 가능한 클래스 제작 시 반드시 구현할 필요가 없는 함수 : 함수 선언 후 pass 키워드 사용
# 상속 가능한 클래스 제작 시 반드시 구현해야 하는 함수 : 함수 선언 후 raise NotImplementedError("message") 작성
