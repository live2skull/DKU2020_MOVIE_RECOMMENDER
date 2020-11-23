import React from "react";
import {Rating, Comment, Segment} from "semantic-ui-react";
import usericon from "../Movie/usericon.png";
import axios from "axios";

class UserCommentItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: ''
        }
    }

    componentDidMount() {
        this._nicknameParse();
    }

    _nicknameParse() {
        axios.get("/data/users/myinfo",
            {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}}
        ).then(data => {
            this.setState({
                nickname: data.data.nickname
            })
        }).catch(error => {
            console.log(error)
        });
    }

    _deleteComment() {
        return (
            axios.post("/data/users/delete_comment", {movie_id: this.props.movie_id},
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

    handleSubmit = () => {
        this._deleteComment();
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
                                <div>{this.props.score}&nbsp;&nbsp;&nbsp;
                                    <Rating icon='star' rating={parseInt(this.props.score)} maxRating={10} disabled/>
                                </div>
                            </Comment.Metadata>
                            <Comment.Text>
                                {this.props.body}
                            </Comment.Text>
                            {this.state.nickname === this.props.nickname ?
                                <Comment.Action onClick={this.handleSubmit} style={{cursor:'pointer'}}>
                                    삭제
                                </Comment.Action>
                                : null}
                        </Comment.Content>
                    </Comment>
                </Comment.Group>
            </Segment>
        )
    }
}

export default UserCommentItem;