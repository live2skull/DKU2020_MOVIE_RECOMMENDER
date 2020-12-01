import React from "react"
import {Link} from 'react-router-dom'
import {Button, Table} from "semantic-ui-react"
import axios from "axios"

// 자신이 작성한 평가를 만드는 컴포넌트입니다. 회원 정보 페이지에서 사용됩니다.
class MyCommentItem extends React.Component {
    // state 로 nickname, title
    constructor(props) {
        super(props)
        this.state = {
            nickname: '',
            title: ''
        }
    }

    // 컴포넌트가 마운트된 직후, 즉 컴포넌트가 만들어지고 첫 렌더링을 마친 후 실행되는 함수입니다.
    componentDidMount() {
        this._nicknameParse()
        this._titleParse()
    }

    // API 의 유저 정보를 출력하는 기능에서 nickname 만 파싱하여 state 의 nickname 으로 설정하는 함수입니다.
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

    // API 의 영화 하나의 정보를 출력하는 기능에서 title 만 파싱하여 state 의 title 로 설정하는 함수입니다.
    _titleParse() {
        axios.get("https://api.movie.live2skull.kr/data/movies/" + this.props.movie_id)
            .then(movie => {
                this.setState({
                    title: movie.data.name
                })
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

    // "삭제" 버튼을 클릭 시 실행되는 함수입니다.
    handleSubmit = () => {
        this._deleteComment()
    }

    render() {
        return (
            <Table.Row>
                <Table.Cell>{this.state.title}</Table.Cell>
                <Table.Cell>{this.props.score}</Table.Cell>
                <Table.Cell>{this.props.body}</Table.Cell>
                <Table.Cell textAlign='right'>
                    {/* 수정 버튼 클릭 시, 해당 영화 정보 페이지로 이동합니다. */}
                    <Button as={Link} to={'/movieinfo?movie_id=' + this.props.movie_id}>
                        수정
                    </Button>
                    <Button onClick={this.handleSubmit}>
                        삭제
                    </Button>
                </Table.Cell>
            </Table.Row>
        )
    }
}

export default MyCommentItem