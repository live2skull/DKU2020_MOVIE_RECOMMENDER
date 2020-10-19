from typing import Generator
from datetime import date
import lxml.html
from lxml.html import HtmlElement
from parse import parse

from .raw_models import RMovie, RMovieUserComment

class NaverMovieParser:
    '''
    네이버 영화로부터 전달받은 HTML 데이터 페이지를 RawModel 로 파싱하는 구현체입니다.
    '''

    def init_lxml(self, ret: str) -> HtmlElement:
        return lxml.html.document_fromstring(ret)


    def parse_movie_info(self, raw: str) -> RMovie:
        '''
        영화 기본 정보를 파싱합니다.
        :param raw:
        :return:
        '''

        html = self.init_lxml(raw)
        ret = RMovie()

        ret.name = html.xpath("//h3[@class='h_movie']/a")[0].text_content()
        ret.thumb_url = html.xpath("//div[@class='poster']/a/img")[0].attrib["src"]
        ret.description = html.xpath("//p[@class='con_tx']")[0].xpath('string()')

        open_year = int(html.xpath("//p[@class='info_spec']/span[4]/a[1]")[0].text_content())
        _, open_month, open_day = html.xpath("//p[@class='info_spec']/span[4]/a[2]")[0].text_content().split('.')
        ret.opened_at = date(year=open_year, month=int(open_month), day=int(open_day))

        ret.genres = []

        for genre in html.xpath("//p[@class='info_spec']/span/a"):
            name = genre.text_content()
            genre_id = int(parse("/movie/sdb/browsing/bmovie.nhn?genre={}", genre.attrib['href'])[0])
            ret.genres.append((name, genre_id))

        return ret


    def parse_movie_poster_url(self, raw: str) -> str:
        """
        영화 포스터 페이지를 파싱합니다.
        :param raw:
        :return:
        """

        html = self.init_lxml(raw)
        return html.xpath("//img[@id='targetImage']")[0].attrib["src"]


    def parse_recommends_from_movie_page(self, raw: str) -> Generator:
        """
        각 영화 페에지의 평점 정보를 파싱합니다.
        :param raw:
        :return:
        """

        html = self.init_lxml(raw)
        count = 0

        for _recommend in html.xpath("//div[@class='score_result']/ul/li"):
            recommend = RMovieUserComment() # type: RMovieUserComment
            recommend.score = int(_recommend.xpath("//div[@class='star_score]/em")[0].text_content())
            recommend.body = str(_recommend.xpath(
                ".//div[@class='score_reple']//span[@id != 'ico_viewer']")[0].text_content()).strip()

            ## id 정보 파싱
            report = _recommend.xpath(".//div[@class='score_reple']/dl/dd/a")[0].attrib['onclick']
            report = report[:-len("', 'point_after', false);return false;")]
            recommend.id = int(report[report.rindex("'") + 1:])

            count += 1
            yield recommend

        if count == 0:
            yield from []


    def parse_recommends_from_user_page(self, raw: str) -> Generator:
        """
        각 사용자별 페이지의 평점 정보를 파싱합니다.
        :param raw:
        :return:
        """

        html = self.init_lxml(raw)
        count = 0

        for _recommend in html.xpath("//table[@class='list_netizen']/tbody/tr"):
            recommend = RMovieUserComment() # type: RMovieUserComment
            recommend.id = int(_recommend.xpath("./td[@class='ac num']")[0].text_content())
            recommend.score = int(_recommend.xpath(".//div[@class='list_netizen_score']//em")[0].text_content())
            recommend.body = _recommend.xpath("./td[@class='title']")[0].text_content()

            # 사용자 페이지에서 가져오는 것이므로, 영화 고유번호가 필요함
            movie_link = _recommend.xpath("./td[@class='title']/a")[0].attrib['href']
            recommend.movie_id = int(parse("?st=mcode&sword={}&target=after", movie_link))

            count += 1
            yield recommend

        if count == 0:
            yield from []
