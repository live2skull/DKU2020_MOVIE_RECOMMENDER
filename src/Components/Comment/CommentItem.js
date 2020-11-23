import React from "react";
import {Rating, Comment, Segment} from "semantic-ui-react";
import usericon from "../Movie/usericon.png";

class CommentItem extends React.Component {
    render() {
        return (
            <Segment>
                <Comment.Group>
                    <Comment>
                        <Comment.Avatar src={usericon}/>
                        <Comment.Content>
                            <Comment.Author>익명</Comment.Author>
                            <Comment.Metadata>
                                <div>{this.props.score}&nbsp;&nbsp;&nbsp;
                                    <Rating icon='star' rating={parseInt(this.props.score)} maxRating={10} disabled />
                                </div>
                            </Comment.Metadata>
                            <Comment.Text>
                                {this.props.body}
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>
                </Comment.Group>
            </Segment>
        )
    }
}

export default CommentItem;