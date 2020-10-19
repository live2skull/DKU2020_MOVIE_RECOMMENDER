from typing import Generator

from requests import Session

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36'
HOME = 'https://movie.naver.com/%s'


class NaverMovieRequester(Session):
    '''
    네이버 영화로부터 HTML 페에지 데이터를 가져오는 구현체입니다.
    '''

    def __init__(self):
        super().__init__()
        self.headers['User-Agent'] = USER_AGENT


    def check_page_available(self, ret: str, page_id: int) -> bool:
        return ret.find('<span class="on">%s</span>' % page_id) != -1


    # 영화정보 불러오기
    def request_movie_info(self, movie_id: int) -> str:
        '''
        영화 기본정보 페이지를 불러옵니다.

        :param movie_id: 영화 고유 아이디
        :return:
        '''

        params = {
            'code' : movie_id
        }

        ret = self.get(url=HOME % '/movie/bi/mi/basic.nhn', params=params).text
        return ret


    def request_movie_poster_url(self, movie_id: int) -> str:
        """
        영화의 메인 포스터를 불러옵니다.

        :param movie_id: 영화 고유 아이디
        :return:
        """

        params = {
            'movieCode': movie_id
        }

        ret = self.get(url=HOME % '/movie/bi/mi/photoViewPopup.nhn', params=params).text
        return ret


    # 추천정보 불러오기
    # ------------------------------------------------------------------------------------

    def request_movie_recommends(self, movie_id: int, page: int) -> str:
        '''
        지정한 영화 고유 번호로부터 댓글 페이지를 출력합니다.
        
        :param movie_id: 영화 아이디 
        :param page: 대상 페이지
        :return: 
        '''

        params = {
            'code' : movie_id,
            'type' : 'after',
            'isActualPointWriteExecute' : 'false',
            'isMileageSubscriptionAlready' : 'false',
            'isMileageSubscriptionReject' : 'false',
            'page' : page
        }

        ret = self.get(url=HOME % '/movie/bi/mi/pointWriteFormList.nhn', params=params).text
        return ret


    def request_movie_recommends_until_end(self, movie_id: int, start_page: int=1) -> Generator:
        '''
        지정한 영화 고유 번호로부터 가용한 페이지까지 댓글 페이지를 불러옵니다.

        :param movie_id: 영화 아이디
        :param start_page: 시작 페이지
        :return:
        '''
        page = start_page

        while True:

            ret = self.request_movie_recommends(movie_id=movie_id, page=page)  # type: str

            ## 페이지가 넘어갔을 때, 해당 페이지가 없다면 가용한 가장 마지막 페이지가 출력됩니다.
            if not self.check_page_available(ret, page): break

            yield ret
            page += 1

        if start_page == page:
            yield from []


    def request_user_recommends(self, user_id:int, page: int) -> str:
        '''
        지정한 사용자 고유 번호로부터 댓글 페이지를 출력합니다.

        :param user_id: 사용자 아이디
        :param page: 대상 페이지
        :return:
        '''

        params = {
            'st' : 'nickname',
            'target' : 'after',
            'sword' : user_id,
            'page' : page
        }

        ret = self.get(url=HOME % '/movie/point/af/list.nhn', params=params).text
        return ret


    def request_user_recommends_until_end(self, user_id:int, start_page: int=1) -> Generator:
        '''
        지정한 사용자 고유 번호로부터 가용한 페이지까지 댓글 페이지를 불러옵니다.

        :param user_id: 사용자 아이디
        :param start_page: 시작 페이지
        :return:
        '''

        page = start_page

        while True:

            ret = self.request_user_recommends(user_id=user_id, page=page) # type: str

            ## 페이지가 넘어갔을 때, 해당 페이지가 없다면 가용한 가장 마지막 페이지가 출력됩니다.
            if not self.check_page_available(ret, page): break

            yield ret
            page += 1

        if start_page == page:
            yield from []


    