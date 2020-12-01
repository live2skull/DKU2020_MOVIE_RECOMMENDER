import React from "react"
import {Form, Segment, Grid} from "semantic-ui-react"
import axios from "axios"
import Topbar from "../Menu/Topbar"

// 로그인 페이지 컴포넌트입니다.
class LoginPage extends React.Component {
    // state 로 email, password
    state = {
        email: '',
        password: ''
    }

    // 각 텍스트 입력 상자에 문자열을 입력하면 각 name 에 해당하는 state 의 값으로 설정하는 함수입니다.
    handleChange = (e, {name, value}) => this.setState({[name]: value})

    // "로그인" 버튼을 클릭하면 실행하는 함수입니다.
    handleSubmit = () => {
        this._login()
    }

    // API 의 로그인 기능을 구현한 함수입니다.
    _login() {
        // API 의 로그인 기능을 이용할 때, 각 데이터를 한번에 넘기기 위한 구조체 입니다.
        const LoginData = {
            email: this.state.email,
            password: this.state.password
        }
        return (
            axios.post("https://api.movie.live2skull.kr/data/users/login", LoginData)
                .then((response) => {
                    if (response.data.result === true) {
                        alert('로그인 되었습니다 !')
                        localStorage.setItem("token", response.data.auth_token)    // API 에 post 하였을 때, 반환되는 토큰 값을 localStorage 에 저장합니다.
                        this.props.history.push('/')                               // 메인 화면으로 이동
                    } else {                                                       // API 에 post 하였을 때, 반환되는 result 가 false 이면
                        alert(response.data.error_message)                         // 반환되는 에러 메시지를 alert 합니다.
                    }
                }).catch(() => {
                alert('로그인에 실패하셨습니다 !')
            })
        )
    }

    render() {
        const {email, password} = this.state

        return (
            <div>
                <Topbar/>
                <Grid textAlign='center' style={{height: '80vh'}} verticalAlign='middle'>
                    <Grid.Column style={{maxWidth: 450}}>
                        <Form size='large' onSubmit={this.handleSubmit} method={'POST'}>
                            <Segment stacked>
                                <Form.Input
                                    fluid icon='user'
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
                                    placeholder='비밀번호'
                                    name='password'
                                    type='password'
                                    value={password}
                                    onChange={this.handleChange}
                                />
                                <Form.Button color='teal' fluid size='large'>
                                    로그인
                                </Form.Button>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default LoginPage