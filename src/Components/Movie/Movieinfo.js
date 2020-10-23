import React from "react";
import {Segment, Header, Image, Rating, Comment, Form, Button} from "semantic-ui-react";
import Topbar1 from "../Menu/Topbar1";
import Topbar2 from "../Menu/Topbar2";
import UserComment from "./UserComment"
import eximage from "./ex_image.jpg"
import usericon from "./usericon.png";

class Movieinfo extends React.Component {
    render() {
        return (
            <div>
                <Topbar1/>
                <Topbar2/>
                <Segment.Group>
                <Segment.Group horizontal>
                    <Segment><Image bordered rounded size='large' src={eximage}/></Segment>
                    <Segment.Group vertical>
                        <Segment>
                            <Header as='h3' style={{fontSize: '1.6em'}}>
                            영화 제목 : 어바웃타임
                            </Header>
                        </Segment>
                        <Segment>
                            <Header as='h3' style={{fontSize: '1.6em'}}>
                                평점 : 9.28  <Rating icon='star' defaultRating={4} maxRating={5} disabled/>
                            </Header>
                        </Segment>
                        <Segment>장르 : 멜로/로맨스, 코미디</Segment>
                        <Segment>감독 : 리차드 커티스</Segment>
                        <Segment>출연 : 도널 글리슨(팀), 레이첼 맥아담스(메리)</Segment>
                        <Segment>개봉일 : 2013.12.05</Segment>
                        <Segment>
                            <p>
                                모태솔로 팀(돔놀 글리슨)은 성인이 된 날, 아버지(빌 나이)로부터 놀랄만한 가문의 비밀을 듣게 된다.
                                바로 시간을 되돌릴 수 있는 능력이 있다는 것!
                                그것이 비록 히틀러를 죽이거나 여신과 뜨거운 사랑을 할 수는 없지만,
                                여자친구는 만들어 줄 순 있으리..
                            </p>
                            <p>
                                꿈을 위해 런던으로 간 팀은 우연히 만난 사랑스러운 여인 메리에게 첫눈에 반하게 된다.
                                그녀의 사랑을 얻기 위해 자신의 특별한 능력을 마음껏 발휘하는 팀.
                                어설픈 대시, 어색한 웃음은 리와인드! 뜨거웠던 밤은 더욱 뜨겁게 리플레이!
                                꿈에 그리던 그녀와 매일매일 최고의 순간을 보낸다.
                            </p>
                            <p>
                                하지만 그와 그녀의 사랑이 완벽해질수록 팀을 둘러싼 주변 상황들은 미묘하게 엇갈리고,
                                예상치 못한 사건들이 여기저기 나타나기 시작하는데…
                            </p>
                            <p>
                            어떠한 순간을 다시 살게 된다면, 과연 완벽한 사랑을 이룰 수 있을까?
                            </p>
                        </Segment>
                    </Segment.Group>
                </Segment.Group>
                    <UserComment/>
                </Segment.Group>
            </div>
        )
    }
}

export default Movieinfo;