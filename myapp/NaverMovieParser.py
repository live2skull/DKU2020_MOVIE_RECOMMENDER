from typing import Generator
from datetime import date
import lxml.html
from lxml.html import HtmlElement
from parse import parse

from .raw_models import RMovie

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
        raise NotImplementedError()


    def parse_recommends_from_user_page(self, raw: str) -> Generator:
        raise NotImplementedError()