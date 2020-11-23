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
            axios.post("http://api.movie.live2skull.kr:9090/data/users/login", LoginData)
                .then((response) => {
                    if (response.data.result === true) {
                        alert('로그인 되었습니다 !');
                        localStorage.setItem("token", response.data.auth_token);
                        this.props.history.push('/');
                    } else {
                        alert(response.data.error_message);
                    }
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

export default Login;