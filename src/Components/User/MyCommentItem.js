import React from "react";
import {Link} from 'react-router-dom';
import {Button, Table} from "semantic-ui-react";
import axios from "axios";

class MyCommentItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: '',
            title: ''
        }
    }

    componentDidMount() {
        this._nicknameParse()
        this._getTitle()
    }

    _nicknameParse() {
        axios.get("http://api.movie.live2skull.kr:9090/data/users/myinfo",
            {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}}
        ).then(data => {
            this.setState({
                nickname: data.data.nickname
            })
        }).catch(error => {
            console.log(error)
        });
    }

    _getTitle() {
        axios.get("http://api.movie.live2skull.kr:9090/data/movies/" + this.props.movie_id)
            .then(movie => {
                this.setState({
                    title: movie.data.name
                })
            })
    }

    _deleteComment() {
        return (
            axios.post("http://api.movie.live2skull.kr:9090/data/users/delete_comment", {movie_id: this.props.movie_id},
                {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}}
            )
                .then((response) => {
                    if (response.data.result === true) {
                        window.location.reload()
                    } else {
                        alert(response.data.error_message);
                    }
                }).catch(() => {
                alert('삭제에 실패하셨습니다 !');
            })
        )
    }

    delete = () => {
        this._deleteComment();
    }

    render() {
        return (
            <Table.Row>
                <Table.Cell>{this.state.title}</Table.Cell>
                <Table.Cell>{this.props.score}</Table.Cell>
                <Table.Cell>{this.props.body}</Table.Cell>
                <Table.Cell textAlign='right'>
                    <Button as={Link} to={'/movieinfo?movie_id=' + this.props.movie_id}>
                        수정
                    </Button>
                    <Button onClick={this.delete}>
                        삭제
                    </Button>
                </Table.Cell>
            </Table.Row>
        )
    }
}

export default MyCommentItem;