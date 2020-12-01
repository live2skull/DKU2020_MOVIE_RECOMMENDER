import React from "react";
import {Form, Segment, Grid} from "semantic-ui-react";
import Topbar from "../Menu/Topbar";
import axios from "axios";

class Signup extends React.Component {
    state = {
        email: '',
        password: '',
        password_confirm: '',
        nickname: '',
    }

    handleChange = (e, {name, value}) => this.setState({[name]: value})

    handleSubmit = () => {
        this._join()
    }

    _join() {
        const JoinData = {
            email: this.state.email,
            password: this.state.password,
            password_confirm: this.state.password_confirm,
            nickname: this.state.nickname
        }
        return (
            axios.post("https://api.movie.live2skull.kr/data/users/join", JoinData)
                .then((response) => {
                    if (response.data.result === false) {
                        alert(response.data.error_message);
                    }
                    else {
                        alert('가입 되었습니다 !');
                        this.props.history.push('/login');
                    }
                }).catch(() => {
                alert('가입에 실패하셨습니다 !');
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

export default Signup;