import React from "react";
import {Form, Segment, Grid} from "semantic-ui-react";
import Topbar from "../Menu/Topbar";
import axios from "axios";

class Login extends React.Component {
    state = {
        email: '',
        password: ''
    }

    handleChange = (e, {name, value}) => this.setState({[name]: value})

    handleSubmit = () => {
        this._login()
    }

    _login() {
        const LoginData = {
            email: this.state.email,
            password: this.state.password
        }

        return (
            axios.post("/data/users/login", LoginData)
                .then((response) => {
                    if(response.data.result === true){
                    alert('로그인 되었습니다 !');
                    localStorage.setItem("token",response.data.auth_token);
                    this.props.history.push('/');
                    }
                    else{
                        alert(response.data.error_message);
                    }
                    // localStorage.setItem("nickname",response.data.nickname);
                    // axios.defaults.headers.common['Authorization'] = `Token ${response.data.auth_token}`; // 토큰값 헤더에 추가
                }).catch(() => {
                alert('로그인에 실패하셨습니다 !');
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
                        <Form size='large' onSubmit={this.handleSubmit}>
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
                        {/*<Message>*/}
                        {/*    아이디 / 비밀번호를 잊으셨나요?*/}
                        {/*    <Button color='teal' fluid size='large'>*/}
                        {/*        아이디 / 비밀번호 찾기*/}
                        {/*    </Button>*/}
                        {/*</Message>*/}
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default Login;