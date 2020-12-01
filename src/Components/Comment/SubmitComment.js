import React from "react"
import {Header, Form, Rating, Segment} from "semantic-ui-react"
import axios from "axios"

class SubmitComments extends React.Component {
    // state 로 movie_id, score, description
    constructor(props) {
        super(props)
        this.state = {
            movie_id: this.props.movie_id,  // Comments 에서 props 로 전달받은 movie_id를 state 로 설정합니다.
            score: 0,
            description: ''
        }
    }

    // 별점을 선택하였을 때, score 로 해당 별점만큼 설정하는 함수입니다.
    handleRate = (e, rating) => {
        this.setState({
            score: parseInt(rating.rating)
        })
    }

    // 평가를 작성하였을 때, 해당 value 를 state 로 설정하는 함수입니다.
    handleChange = (e, {name, value}) => this.setState({[name]: value})

    // "평가하기" 버튼을 눌렀을 때 호출되는 함수를 설정하는 함수입니다.
    handleSubmit = () => {
        this._submitComment()
    }

    // API 의 댓글을 작성하는 기능을 구현한 함수입니다.
    _submitComment() {
        // API 의 댓글을 작성하는 기능을 이용할 때, 각 데이터를 한번에 넘기기 위한 구조체 입니다.
        const CommentData = {
            movie_id: this.state.movie_id,
            score: this.state.score,
            body: this.state.description
        }
        return (
            axios.post("https://api.movie.live2skull.kr/data/users/edit_comment", CommentData,
                {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}}
            )
                .then((response) => {
                    if (response.data.result === true)
                        window.location.reload()
                }).catch(() => {
                alert('작성에 실패하셨습니다 !')
            })
        )
    }


    render() {
        const {description} = this.state

        return (
            <div>
                <Segment raised>
                    <Header as='h2' dividing>
                        평가하기
                    </Header>
                    <Segment>
                        <Segment.Group horizontal>
                            <Segment>
                                <Form onSubmit={this.handleSubmit}>
                                    <Segment>
                                        평점 : <Rating icon='star' maxRating={10} onRate={this.handleRate} clearable/>
                                    </Segment>
                                    <Form.TextArea
                                        name='description'
                                        value={description}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Button secondary>평가하기</Form.Button>
                                </Form>
                            </Segment>
                        </Segment.Group>
                    </Segment>
                </Segment>
            </div>
        )
    }
}

export default SubmitComments