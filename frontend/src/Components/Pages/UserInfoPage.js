import React from "react"
import {Segment, Grid, Table} from "semantic-ui-react"
import axios from "axios"
import Topbar from "../Menu/Topbar"
import MyCommentItem from "../Comment/MyCommentItem"

// 회원 정보 페이지 컴포넌트 입니다.
class UserInfoPage extends React.Component {
    // state 로 email, nickname, my_comments, movie_title
    state = {
        email: '',
        nickname: '',
        my_comments: [],
        movie_title: ''
    }

    // 컴포넌트가 마운트된 직후, 즉 컴포넌트가 만들어지고 첫 렌더링을 마친 후 실행되는 함수입니다.
    componentDidMount() {
        this._infoParse()
    }

    // API 의 유저 정보를 출력하는 기능을 구현한 함수입니다.
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
            console.log(error)
        })
    }

    render() {
        const my_comment_list = []

        // state 의 my_comments 에 foreach 구문을 적용시켜 원소인 my_comment 마다 해당하는 props 를 MyCommentItem 에 넘긴 결과를
        // my_comment_list 의 원소로 추가합니다.
        // eslint-disable-next-line array-callback-return
        this.state.my_comments.map(my_comment => {
            my_comment_list.push(<MyCommentItem movie_id={my_comment.movie_id}
                                                nickname={my_comment.nickname}
                                                score={my_comment.score}
                                                body={my_comment.body}/>)
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
                                    {my_comment_list}
                                </Table.Body>
                            </Table>
                        </Segment.Group>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default UserInfoPage