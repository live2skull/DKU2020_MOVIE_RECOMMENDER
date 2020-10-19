import React from "react";
import {Header, Comment, Form, Rating, Button} from "semantic-ui-react";
import usericon from "./usericon.png"

class UserComment extends React.Component {
    render() {
        return (
            <div>
                <Comment.Group>
                    <Header as='h2' dividing>
                        한줄 평가
                    </Header>

                    <Comment>
                        <Comment.Avatar src={usericon}/>
                        <Comment.Content>
                            <Comment.Author as='a'>사용자 1</Comment.Author>
                            <Comment.Metadata>
                                <div>2020/10/20 at 12:42AM</div>
                            </Comment.Metadata>
                            <Comment.Metadata>
                                <div> <Rating icon='star' defaultRating={5} maxRating={5} disabled/> </div>
                            </Comment.Metadata>
                            <Comment.Text>
                                재밌어요!
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>

                    <Comment>
                        <Comment.Avatar src={usericon}/>
                        <Comment.Content>
                            <Comment.Author as='a'>사용자 2</Comment.Author>
                            <Comment.Metadata>
                                <div>2020/10/20 at 1:30AM</div>
                            </Comment.Metadata>
                            <Comment.Metadata>
                                <div> <Rating icon='star' defaultRating={4} maxRating={5} disabled/> </div>
                            </Comment.Metadata>
                            <Comment.Text>
                                <p>감동적이에요!</p>
                            </Comment.Text>
                        </Comment.Content>
                    </Comment>

                    <Header as='h2' dividing>
                        평가하기
                    </Header>
                    <Form reply>
                        평점 : <Rating icon='star' maxRating={5} clearable/>
                        <Form.TextArea/>
                        <Button content='평가하기' labelPosition='left' icon='edit' primary/>
                    </Form>
                </Comment.Group>
            </div>
        )
    }
}

export default UserComment;