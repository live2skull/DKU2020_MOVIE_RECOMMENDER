import React from "react";
import {Header, Form, Rating, Button, Segment, Menu} from "semantic-ui-react";
import axios from "axios"; // API 연동
import CommentItem from "./CommentItem";

class UserComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commentList: [],
            cpage_id: 1
        };
    }

    handleItemDown = (e) => {
        if(this.state.cpage_id === 1) {
            this.setState({
                cpage_id: 1 })
        } else {
            this.setState({
                cpage_id: this.state.cpage_id - 1 })
        }
        this.componentDidMount();
    }

    handleItemUp = (e) => {
        this.setState({
            cpage_id: this.state.cpage_id + 1 })
        this.componentDidMount();
    }

    componentDidMount() {
        this._getCommentList();
    }

    _getCommentList() {
        axios.get("/data/comments/" + this.props.movie_id + "?page=" + this.state.cpage_id)
            .then(data => {
                this.setState({
                    commentList: data.data.results
                });
            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        const comments = [];
        {
            this.state.commentList.map(comment => {
                comments.push(<CommentItem score={comment.score} body={comment.body}/>);
            })
        }

        return (
            <div>
                <br/>
                <Segment raised>
                    <Header as='h2' dividing>
                        한줄 평
                    </Header>
                    <Segment>
                        <Segment.Group vertical>
                            {comments}
                        </Segment.Group>
                    </Segment>
                    <Menu widths={2}>
                        <Menu.Item onClick={this.handleItemDown}>Down</Menu.Item>
                        <Menu.Item onClick={this.handleItemUp}>Up</Menu.Item>
                    </Menu>
                </Segment>
                <br/>

                <div>
                    <Segment raised>
                        <Header as='h2' dividing>
                            평가하기
                        </Header>
                        <Segment>
                            <Segment.Group horizontal>
                                <Segment>
                                    <Form reply>
                                        <Segment>
                                            평점 : <Rating icon='star' maxRating={10} clearable/>
                                        </Segment>
                                        <Form.TextArea/>
                                    </Form>
                                </Segment>
                            </Segment.Group>
                            <Button secondary>평가하기</Button>
                        </Segment>
                    </Segment>
                </div>
                <br/>
            </div>
        )
    }
}

export default UserComment;