import React from "react"
import {Header, Segment, Menu} from "semantic-ui-react"
import axios from "axios"
import AnonyCommentItem from "./AnonyCommentItem"
import UserCommentItem from "./UserCommentItem"
import SubmitComment from "./SubmitComment"

// 영화 정보 페이지에서 댓글 부분을 담당하는 컴포넌트입니다.
class Comments extends React.Component {
    // state 로 익명 댓글 리스트(anonyCommentList),
    // 사용자 댓글 리스트(userCommentList), 익명 댓글 페이지 id(page_id)
    constructor(props) {
        super(props)
        this.state = {
            anonyCommentList: [],
            userCommentList: [],
            page_id: 1
        }
    }

    // 익명 댓글 부분에서 이전 익명 댓글 페이지로 이동하는 함수입니다.
    handleItemDown = () => {
        if (this.state.page_id === 1) {
            this.setState({
                page_id: 1
            })
        } else {
            this.setState({
                page_id: this.state.page_id - 1
            })
        }
        this._getAnonyCommentList()
    }

    // 익명 댓글 부분에서 다음 익명 댓글 페이지로 이동하는 함수입니다.
    handleItemUp = () => {
        this.setState({
            page_id: this.state.page_id + 1
        })
        this._getAnonyCommentList()
    }

    // 컴포넌트가 마운트된 직후, 즉 컴포넌트가 만들어지고 첫 렌더링을 마친 후 실행되는 함수입니다.
    componentDidMount() {
        this._getAnonyCommentList()
        this._getUserCommentList()
    }

    // API 의 익명 댓글 리스트를 불러오는 기능을 구현한 함수입니다.
    _getAnonyCommentList() {
        axios.get("https://api.movie.live2skull.kr/data/comments/" +
            this.props.movie_id + "?page=" + this.state.page_id)
            .then(data => {
                this.setState({
                    anonyCommentList: data.data.results
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    // API 의 사용자 댓글 리스트를 불러오는 기능을 구현한 함수입니다.
    _getUserCommentList() {
        axios.get("https://api.movie.live2skull.kr/data/user_comments/" + this.props.movie_id)
            .then(data => {
                this.setState({
                    userCommentList: data.data.results
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        const anonyComments = []

        // state 의 anonyCommentList 에 foreach 구문을 적용시켜 원소인 a_Comment 마다 해당하는 props 를 AnonyCommentItem 에 넘긴 결과를
        // anonyComments 의 원소로 추가합니다.
        // eslint-disable-next-line array-callback-return
        this.state.anonyCommentList.map(a_Comment => {
            anonyComments.push(<AnonyCommentItem score={a_Comment.score}
                                                 body={a_Comment.body}/>)
        })


        const user_comments = []

        // state 의 userCommentList 에 foreach 구문을 적용시켜 원소인 u_comment 마다 해당하는 props 를 UserCommentItem 에 넘긴 결과를
        // user_comments 의 원소로 추가합니다.
        // eslint-disable-next-line array-callback-return
        this.state.userCommentList.map(u_comment => {
            user_comments.push(<UserCommentItem movie_id={this.props.movie_id}
                                                nickname={u_comment.nickname}
                                                score={u_comment.score}
                                                body={u_comment.body}/>)
        })

        return (
            <div>
                <br/>
                <Segment raised>
                    <Header as='h2' dividing>
                        익명 한줄 평
                    </Header>
                    <Segment>
                        <Segment.Group vertical>
                            {anonyComments}
                        </Segment.Group>
                    </Segment>
                    <Menu widths={2}>
                        <Menu.Item onClick={this.handleItemDown}>Down</Menu.Item>
                        <Menu.Item onClick={this.handleItemUp}>Up</Menu.Item>
                    </Menu>
                </Segment>
                <br/>

                <Segment raised>
                    <Header as='h2' dividing>
                        유저 한줄 평
                    </Header>
                    <Segment>
                        <Segment.Group vertical>
                            {user_comments}
                        </Segment.Group>
                    </Segment>
                </Segment>
                <br/>
                <SubmitComment movie_id={this.props.movie_id}/>
                {/* SubmitComment 컴포넌트에 props 로 movie_id를 전달합니다. */}
                <br/>
            </div>
        )
    }
}

export default Comments