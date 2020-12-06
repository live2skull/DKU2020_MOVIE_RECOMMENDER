## 네이버 영화 Web 요청 기능을 제공합니다.
# @package myapp.NaverMovieRequester

from typing import Iterator
from requests import Session

## Web HTTP 요청에 사용되는 User-Agent 헤더 값입니다.
USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'

## 네이버 영화 최상단 URL
HOME = 'https://movie.naver.com/%s'

## 네이버 영화 서비스로부터 HTML 데이터를 요청하는 기능을 제공합니다.
# 각 메서드는 요청된 HTML 문서 / 제네레이터를 반환합니다.
class NaverMovieRequester(Session):
    
    def __init__(self):
        super().__init__()
        self.headers['User-Agent'] = USER_AGENT

    ## 페이지가 유효한 페이지인지 검증합니다.
    # @param ret: HTML 문서입니다.
    # @param page_id: 페이지 고유번호입니다.
    def check_page_available(self, ret: str, page_id: int) -> bool:
        return ret.find('<span class="on">%s</span>' % page_id) != -1


    ## 현재 상영중인 영화 정보를 불러옵니다.
    # @return: str HTML 문서입니다.
    def request_showing_movie_list(self) -> str:
        ret = self.get(url=HOME % "/movie/running/current.nhn", verify=False).text
        return ret


    ## 영화 기본정보 페이지를 불러옵니다.
    # @param movie_id: 영화 고유 아이디
    # @return: str HTML 문서입니다.
    def request_movie_info(self, movie_id: int) -> str:
        params = {
            'code' : movie_id
        }

        ret = self.get(url=HOME % '/movie/bi/mi/basic.nhn', params=params, verify=False).text
        return ret


    ## 영화의 메인 포스터를 불러옵니다.
    # @param movie_id: 영화 고유 아이디
    # @return: str HTML 문서입니다.
    def request_movie_poster_url(self, movie_id: int) -> str:
        params = {
            'movieCode': movie_id
        }

        ret = self.get(url=HOME % '/movie/bi/mi/photoViewPopup.nhn', params=params, verify=False).text
        return ret


    ### 추천정보 불러오기 ----------------------------------------------------------------


    ## 지정한 영화 고유 번호로부터 댓글 페이지를 출력합니다.
    ## @param movie_id: 영화 아이디입니다.
    ## @param page: 대상 페이지입니다.
    # @return: str HTML 문서입니다.
    def request_movie_recommends(self, movie_id: int, page: int) -> str:
        params = {
            'code' : movie_id,
            'type' : 'after',
            'isActualPointWriteExecute' : 'false',
            'isMileageSubscriptionAlready' : 'false',
            'isMileageSubscriptionReject' : 'false',
            'page' : page
        }

        ret = self.get(url=HOME % '/movie/bi/mi/pointWriteFormList.nhn', params=params, verify=False).text
        return ret


    ## 지정한 영화 고유 번호로부터 가용한 페이지까지 댓글 페이지를 불러오는 제네레이터입니다.
    # @param movie_id: 영화 아이디입니다.
    # @param start_page: 시작 페이지입니다. 기본값은 1 입니다.
    # @return: Iterator[str] 불러온 HTML 문서 제네레이터입니다.
    def request_movie_recommends_until_end(self, movie_id: int, start_page: int=1) -> Iterator[str]:
        page = start_page

        while True:
            ret = self.request_movie_recommends(movie_id=movie_id, page=page)  # type: str

            ## 페이지가 넘어갔을 때, 해당 페이지가 없다면 가용한 가장 마지막 페이지가 출력됩니다.
            if not self.check_page_available(ret, page): break
            yield ret
            page += 1

        if start_page == page:
            yield from []


    ## 지정한 사용자 고유 번호로부터 댓글 페이지를 출력합니다.
    # @param comment_id: 사용자로 지정할 특정 코멘트 아이디입니다.
    # @param page: 대상 페이지
    # @return: str HTML 문서입니다.
    def request_user_recommends(self, comment_id:int, page: int) -> str:
        params = {
            'st' : 'nickname',
            'target' : 'after',
            'sword' : comment_id,
            'page' : page
        }

        ret = self.get(url=HOME % '/movie/point/af/list.nhn', params=params, verify=False).text
        return ret


    ## 지정한 사용자 고유 번호로부터 가용한 페이지까지 댓글 페이지를 불러오는 제네레이터입니다.
    # @param comment_id: 사용자 아이디입니다.
    # @param start_page: 시작 페이지입니다.
    # @return: Iterator[str] 불러온 HTML 문서 제네레이터입니다.
    def request_user_recommends_until_end(self, comment_id:int, start_page: int=1) -> Iterator[str]:
        page = start_page

        while True:

            ret = self.request_user_recommends(comment_id=comment_id, page=page) # type: str

            ## 페이지가 넘어갔을 때, 해당 페이지가 없다면 가용한 가장 마지막 페이지가 출력됩니다.
            if not self.check_page_available(ret, page): break

            yield ret
            page += 1

        if start_page == page:
            yield from []


    