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


    def parse_showing_movie_list(self, raw: str) -> Generator[int, int, None]:
        """
        현재 상영중인 영화 정보를 파싱합니다.
        """

        html = self.init_lxml(raw)

        count = 0

        for elem in html.xpath("//ul[@class='lst_detail_t1']/li"): 

            url = elem.xpath(".//div[@class='thumb']/a")[0].attrib['href']
            yield int(parse("/movie/bi/mi/basic.nhn?code={}", url).fixed[0])

            count += 1
            
        if count == 0:
            yield from []
    

    def parse_movie_info(self, raw: str) -> RMovie:
        '''
        영화 기본 정보를 파싱합니다.
        :param raw:
        :return:
        '''

        html = self.init_lxml(raw)
        ret = RMovie()

        ret.name = html.xpath("//h3[@class='h_movie']/a")[0].text_content()

        _description_elem = html.xpath("//p[@class='con_tx']")
        ret.description = None if not len(_description_elem) else _description_elem[0].text_content()

        _thumb_url_elem = html.xpath("//div[@class='poster']/a/img")
        ret.thumb_url = None if not len(_thumb_url_elem) else _thumb_url_elem[0].attrib["src"]

        parsed_open_date = 0

        for i in range(1, 6):
            _open_year = html.xpath("//p[@class='info_spec']/span[%s]/a[1]" % i)
            if not len(_open_year): continue


            if not _open_year[0].text_content().isdigit(): continue
            open_year = int(_open_year[0].text_content())

            _, open_month, open_day = html.xpath("//p[@class='info_spec']/span[%s]/a[2]" % i)[0].text_content().split('.')
            ret.opened_at = date(year=open_year, month=int(open_month), day=int(open_day))
            parsed_open_date += 1
            break

        if parsed_open_date == 0:
            ret.opened_at = date.min
            Warning("%s 영화의 개봉일자를 탐색하지 못했습니다." % ret.name)

        ret.actors = []

        for actor in html.xpath("//div[@class='info_spec2']/dl[@class='step2']/dd/a"):
            _name = actor.text_content().strip()

            ## 이름(역할) 또는 이름으로 주어지므로, 역할 정보는 지워야 충돌이 발생하지 않습니다.
            _name_parse = parse('{}({})', _name)
            name = _name if _name_parse is None else _name_parse.fixed[0]

            actor_id = int(parse("/movie/bi/pi/basic.nhn?code={}", actor.attrib['href']).fixed[0])
            ret.actors.append((actor_id, name))

        ret.genres = []

        for genre in html.xpath("//p[@class='info_spec']/span/a"):
            name = genre.text_content().strip()
            _parsed = parse("/movie/sdb/browsing/bmovie.nhn?genre={}", genre.attrib['href'])
            if _parsed is None: break
            genre_id = int(_parsed.fixed[0])
            ret.genres.append((genre_id, name))

        return ret


    def parse_movie_poster_url(self, raw: str) -> str:
        """
        영화 포스터 페이지를 파싱합니다.
        :param raw:
        :return:
        """

        html = self.init_lxml(raw)

        _img_url_elem = html.xpath("//img[@id='targetImage']")
        return None if not len(_img_url_elem) else _img_url_elem[0].attrib["src"]


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
            recommend.score = int(_recommend.xpath("//div[@class='star_score']/em")[0].text_content())
            # 스포일러 멘트는 별도의 설정이 필요함.
            temp_body = str(_recommend.xpath(".//div[@class='score_reple']//span[@id != 'ico_viewer']")[0].text_content()).strip()

            if temp_body.find('스포일러가 포함된 감상평입니다.') == 0:
                recommend.is_spoiler = True
                recommend.body = str(_recommend.xpath(
                    ".//span[contains(@id, '_filtered_ment_')]")[0].text_content()).strip()
            else:
                recommend.is_spoiler = False
                recommend.body = temp_body

            ## id 정보 파싱
            ## 수정됨
            pointlist = _recommend.xpath(".//div[@class='score_reple']/dl/dt/em/a")[0].attrib['onclick'] # type: str
            recommend.id = int(parse("javascript:showPointListByNid({},{}", pointlist).fixed[0])

            # report = _recommend.xpath(".//div[@class='score_reple']/dl/dd/a")[0].attrib['onclick']
            # report = report[:-len("', 'point_after', false);return false;")]
            # recommend.id = int(report[report.rindex("'") + 1:])

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
            ## target - before / after 두 경우 모두 존재함 - 뒤 데이터까지 입력해야 파서에서 사용할 수 있습니다.
            # ex) '?st=mcode&sword=151196&target=before'
            recommend.movie_id = int(parse("?st=mcode&sword={}&target={}", movie_link).fixed[0])

            count += 1
            yield recommend

        if count == 0:
            yield from []
