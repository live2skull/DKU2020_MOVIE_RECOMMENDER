import React from 'react';
import Topbar from './Menu/Topbar';
import {Grid, Header} from "semantic-ui-react";

class MainPage extends React.Component {

    render() {
        return (
            <div>
                <Topbar/>
                <br/>
                <Grid celled='internally' columns='equal' stackable verticalAlign='middle' style={{height: '80vh'}}>
                    <Grid.Row textAlign='center'>
                        <Grid.Column style={{paddingBottom: '5em', paddingTop: '5em'}}>
                            <Header as='h3' style={{fontSize: '2em'}}>
                                본 사이트는 영화 정보 / 영화 추천을 제공하는 사이트입니다.
                            </Header>
                            <br/>
                            <p style={{fontSize: '1.33em'}}>
                                단국대학교<br/>
                                2020-2 오픈소스SW설계<br/>
                                영화추천플랫폼 팀
                            </p>
                        </Grid.Column>
                        <Grid.Column style={{paddingBottom: '5em', paddingTop: '5em'}}>
                            <Header as='h3' style={{fontSize: '2em'}}>
                                사이트 이용 방법
                            </Header>

                            <p style={{fontSize: '1.33em'}}>
                                <b>영화 검색</b> 페이지에서는 상단 바를 이용하여<br/>
                                <b>장르 / 최소평점 / 제목</b>을 설정하여 해당 조건에 맞는 영화들을 출력합니다.<br/>
                            </p>

                            <p style={{fontSize: '1.33em'}}>
                                <b>영화 카드</b>를 선택하면 해당 영화의 정보를 출력하며<br/>
                                익명 사용자들의 댓글과 평점을 볼 수 있고, 해당 영화의 평가를 직접 작성 할 수 있습니다.
                            </p>

                            <p style={{fontSize: '1.33em'}}>
                                <b>맞춤 추천</b> 페이지에서는 <b>최소 #개</b>의 영화의 평가를 남겨주시면<br/>
                                추천 알고리즘을 통하여 사용자에게 알맞는 영화들을 출력합니다.
                            </p>

                            <p style={{fontSize: '1.33em'}}>
                                <b>로그인 후</b> 상단바에 나타나는 <b>내 정보</b> 페이지에서는<br/>
                                자신이 회원가입시 설정한 이메일 / 닉네임 / 자신이 작성한 평가 목록을 볼 수 있으며<br/>
                                해당 평가를 수정 및 삭제가 가능합니다.
                            </p>

                            <p style={{fontSize: '1.33em'}}>
                                영화 평가는 각 영화당 <b>한번</b>만 가능합니다. <br/>
                                자신이 작성한 평가를 수정하려면 <b>평가하기</b>에 새로 작성하면 됩니다.
                            </p>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default MainPage;