import React from "react"
import {Rating, Comment, Segment} from "semantic-ui-react"
import axios from "axios"
import usericon from "./usericon.png" // 댓글 아이콘에 사용되는 이미지

// 사이트 유저 댓글을 만드는 컴포넌트입니다.
class UserCommentItem extends React.Component {
    // state 로 nickname
    constructor(props) {
        super(props)
        this.state = {
            nickname: ''
        }
    }

    // 컴포넌트가 마운트된 직후, 즉 컴포넌트가 만들어지고 첫 렌더링을 마친 후 실행되는 함수를 설정합니다.
    componentDidMount() {
        this._nicknameParse()
    }

    // API 에서 받아온 정보 중 nickname 을 받아와 state 의 nickname 으로 설정하는 함수입니다.
    _nicknameParse() {
        axios.get("https://api.movie.live2skull.kr/data/users/myinfo",
            {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}}
        ).then(data => {
            this.setState({
                nickname: data.data.nickname
            })
        }).catch(error => {
            console.log(error)
        })
    }

    // API 의 댓글 삭제 기능을 구현한 함수입니다.
    _deleteComment() {
        return (
            axios.post("https://api.movie.live2skull.kr/data/users/delete_comment", {movie_id: this.props.movie_id},
                {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}}
            )
                .then((response) => {
                    if (response.data.result === true) {
                        window.location.reload()
                    } else {
                        alert(response.data.error_message)
                    }
                }).catch(() => {
                alert('삭제에 실패하셨습니다 !')
            })
        )
    }

    // 삭제 버튼을 눌렀을 때 _deleteComment 함수를 실행합니다.
    handleSubmit = () => {
        this._deleteComment()
    }

    render() {
        return (
            <Segment>
                <Comment.Group>
                    <Comment>
                        <Comment.Avatar src={usericon}/>
                        <Comment.Content>
                            <Comment.Author>{this.props.nickname}</Comment.Author>
                            <Comment.Metadata>
                                <div>{this.props.score}&nbsp;&nbsp;&nbsp;   {/* &nbsp; << 공백 한 칸 */}
                                    <Rating icon='star' rating={parseInt(this.props.score)} maxRating={10} disabled/>
                                    {/* Comments 에서 받아온 props 의 score 를 Int 형으로 타입 캐스팅 하여 rating 으로 출력 */}
                                </div>
                            </Comment.Metadata>
                            <Comment.Text>
                                {this.props.body}
                                {/* Comments 에서 받아온 props 의 body 를 내용으로 출력 */}
                            </Comment.Text>
                            {this.state.nickname === this.props.nickname ?
                                <Comment.Action onClick={this.handleSubmit} style={{cursor: 'pointer'}}>
                                    삭제
                                </Comment.Action>
                                : null}
                            {/* 삼항 연산자를 사용하여 조건부 렌더링을 설정합니다. */}
                            {/* 현재 state 의 nickname 과 Comments 로부터 받아온 props 의 nickname 이 같을 때
                             즉, 현재 사용자와 댓글에 있는 사용자의 닉네임이 같을 때 삭제 버튼을 출력합니다. */}
                        </Comment.Content>
                    </Comment>
                </Comment.Group>
            </Segment>
        )
    }
}

export default UserCommentItem