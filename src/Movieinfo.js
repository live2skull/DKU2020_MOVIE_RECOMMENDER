import React from "react";
import {Segment, Grid, Header, Image} from "semantic-ui-react";
import Topbar1 from "./Topbar1";
import Topbar2 from "./Topbar2";
import eximage from "./ex_image.jpg"

class Movieinfo extends React.Component {
    render() {
        return (
            <div>
                <Topbar1/>
                <Topbar2/>
                <Segment style={{padding: '8em 0em'}} vertical>
                    <Grid container stackable verticalAlign='middle'>
                        <Grid.Row>
                            <Grid.Column floated='left' width={6}>
                                <Image bordered rounded size='large' src={eximage}/>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <Header as='h3' style={{fontSize: '2em'}}>
                                    영화 제목 : 어바웃타임
                                </Header>

                                <Header as='h3' style={{fontSize: '2em'}}>
                                    평점 : 9.28
                                </Header>

                                <p style={{fontSize: '1.33em'}}>
                                    감독 : 리차드 커티스
                                </p>

                                <p style={{fontSize: '1.33em'}}>
                                    출연 : 도널 글리슨(팀), 레이첼 맥아담스(메리)
                                </p>

                                <p style={{fontSize: '1.33em'}}>
                                    개봉일 : 2013.12.05
                                </p>

                                <p style={{fontSize: '1.33em'}}>
                                    줄거리 : 모태솔로 팀(돔놀 글리슨)은 성인이 된 날, 아버지(빌 나이)로부터 놀랄만한 가문의 비밀을 듣게 된다.
                                    바로 시간을 되돌릴 수 있는 능력이 있다는 것!
                                    그것이 비록 히틀러를 죽이거나 여신과 뜨거운 사랑을 할 수는 없지만,
                                    여자친구는 만들어 줄 순 있으리..

                                    꿈을 위해 런던으로 간 팀은 우연히 만난 사랑스러운 여인 메리에게 첫눈에 반하게 된다.
                                    그녀의 사랑을 얻기 위해 자신의 특별한 능력을 마음껏 발휘하는 팀.
                                    어설픈 대시, 어색한 웃음은 리와인드! 뜨거웠던 밤은 더욱 뜨겁게 리플레이!
                                    꿈에 그리던 그녀와 매일매일 최고의 순간을 보낸다.

                                    하지만 그와 그녀의 사랑이 완벽해질수록 팀을 둘러싼 주변 상황들은 미묘하게 엇갈리고,
                                    예상치 못한 사건들이 여기저기 나타나기 시작하는데…

                                    어떠한 순간을 다시 살게 된다면, 과연 완벽한 사랑을 이룰 수 있을까?
                                </p>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </div>
        )
    }
}

export default Movieinfo;