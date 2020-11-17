from django.core.management.base import BaseCommand, CommandParser
from myapp.MovieRecommendation import MovieRecommendation

from myapp.models import User

class Command(BaseCommand):

    help = "영화 추천 기능을 테스트합니다."

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):

        user = User.objects.get(id=1)

        recommand = MovieRecommendation()
        results = recommand.get_recommendations_user_based(user)

        print(results)


## 기존에 몰랐던 내용
# 상속 가능한 클래스 제작 시 반드시 구현할 필요가 없는 함수 : 함수 선언 후 pass 키워드 사용
# 상속 가능한 클래스 제작 시 반드시 구현해야 하는 함수 : 함수 선언 후 raise NotImplementedError("message") 작성
