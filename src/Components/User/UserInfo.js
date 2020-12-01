import React from "react";
import {Segment, Grid, Table} from "semantic-ui-react";
import Topbar from "../Menu/Topbar";
import axios from "axios";
import MyCommentItem from "./MyCommentItem";

class UserInfo extends React.Component {
    state = {
        email: '',
        nickname: '',
        my_comments: [],
        movie_title: ''
    }

    componentDidMount() {
        this._infoParse();
    }

    _infoParse() {
        axios.get("https://api.movie.live2skull.kr/data/users/myinfo",
            {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}}
        ).then(data => {
            this.setState({
                email: data.data.email,
                nickname: data.data.nickname,
                my_comments: data.data.comments
            })
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        const items = []

        // eslint-disable-next-line array-callback-return
        this.state.my_comments.map(my_comments => {
            items.push(<MyCommentItem movie_id={my_comments.movie_id}
                                      nickname={my_comments.nickname}
                                      score={my_comments.score}
                                      body={my_comments.body}/>);
        })

        return (
            <div>
                <Topbar/>
                <Grid textAlign='center' style={{height: '80vh'}} verticalAlign='middle'>

                    <Grid.Column style={{maxWidth: 1200}}>

                        <Segment.Group>
                            <Segment><h3>내 정보</h3></Segment>
                            <Segment.Group>
                                <Segment.Group horizontal>
                                    <Segment>이메일</Segment>
                                    <Segment>{this.state.email}</Segment>
                                    <Segment>닉네임</Segment>
                                    <Segment>{this.state.nickname}</Segment>
                                </Segment.Group>
                            </Segment.Group>
                            <Segment><h3>내가 작성한 한줄 평</h3></Segment>
                            <Table singleLine>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>영화제목</Table.HeaderCell>
                                        <Table.HeaderCell>평점</Table.HeaderCell>
                                        <Table.HeaderCell>작성내용</Table.HeaderCell>
                                        <Table.HeaderCell></Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {items}
                                </Table.Body>
                            </Table>
                        </Segment.Group>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default UserInfo;