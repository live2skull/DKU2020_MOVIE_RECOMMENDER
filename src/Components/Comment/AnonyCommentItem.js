import React from "react"
import {Rating, Comment, Segment} from "semantic-ui-react"
import usericon from "./usericon.png"   // 댓글 아이콘에 사용되는 이미지

// 익명 사용자 댓글을 만드는 컴포넌트 입니다.
class AnonyCommentItem extends React.Component {
    render() {
        return (
            <Segment>
                <Comment.Group>
                    <Comment>
                        <Comment.Avatar src={usericon}/>
                        <Comment.Content>
                            <Comment.Author>익명</Comment.Author>
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
                        </Comment.Content>
                    </Comment>
                </Comment.Group>
            </Segment>
        )
    }
}

export default AnonyCommentItem