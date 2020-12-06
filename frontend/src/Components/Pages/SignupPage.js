import React from "react"
import {Form, Segment, Grid} from "semantic-ui-react"
import axios from "axios"
import Topbar from "../Menu/Topbar"

// 회원가입 페이지 컴포넌트입니다.
class SignupPage extends React.Component {
    state = {
        email: '',
        password: '',
        password_confirm: '',
        nickname: '',
    }

    // 각 텍스트 입력 상자에 문자열을 입력하면 각 name 에 해당하는 state 의 값으로 설정하는 함수입니다.
    handleChange = (e, {name, value}) => this.setState({[name]: value})

    // "가입" 버튼을 클릭시 실행하는 함수입니다.
    handleSubmit = () => {
        this._join()
    }

    // API 의 회원가입 기능을 구현한 함수입니다.
    _join() {
        // API 의 회원가입 기능을 이용할 때, 각 데이터를 한번에 넘기기 위한 구조체 입니다.
        const JoinData = {
            email: this.state.email,
            password: this.state.password,
            password_confirm: this.state.password_confirm,
            nickname: this.state.nickname
        }
        return (
            axios.post("https://api.movie.live2skull.kr/data/users/join", JoinData)
                .then((response) => {
                    if (response.data.result === false) {       // API 에 post 하였을 때, 반환되는 result 가 false 이면
                        alert(response.data.error_message)      // 반환되는 에러 메시지를 alert 합니다.
                    } else {
                        alert('가입 되었습니다 !')                // API 에 post 하였을 때, 반환되는 result 가 true 이면
                        this.props.history.push('/login')        // 로그인 페이지로 이동합니다.
                    }
                }).catch(() => {
                alert('가입에 실패하셨습니다 !')
            })
        )
    }

    render() {
        const {email, password, password_confirm, nickname} = this.state

        return (
            <div>
                <Topbar/>
                <Grid textAlign='center' style={{height: '80vh'}} verticalAlign='middle'>
                    <Grid.Column style={{maxWidth: 450}}>
                        <Form size='large' onSubmit={this.handleSubmit}>
                            <Segment stacked>
                                <Form.Input
                                    fluid icon='mail'
                                    iconPosition='left'
                                    placeholder='아이디 (이메일 형식)'
                                    name='email'
                                    type='email'
                                    value={email}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid icon='lock'
                                    iconPosition='left'
                                    placeholder='비밀번호 6자리 이상'
                                    name='password'
                                    type='password'
                                    value={password}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid icon='checkmark'
                                    iconPosition='left'
                                    placeholder='비밀번호 확인'
                                    name='password_confirm'
                                    type='password'
                                    value={password_confirm}
                                    onChange={this.handleChange}
                                />
                                <Form.Input
                                    fluid icon='smile outline'
                                    iconPosition='left'
                                    placeholder='닉네임'
                                    name='nickname'
                                    type='nickname'
                                    value={nickname}
                                    onChange={this.handleChange}
                                />
                                <Form.Button color='teal' fluid size='large'>
                                    가입
                                </Form.Button>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default SignupPage