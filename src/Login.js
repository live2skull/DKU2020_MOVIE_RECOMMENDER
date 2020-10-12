import React from "react";
import {Form, Button, Segment, Message, Grid} from "semantic-ui-react";
import Topbar1 from "./Topbar1";

class Login extends React.Component {
    render() {
        return (
            <div>
                <Topbar1/>
                <Grid textAlign='center' style={{height: '80vh'}} verticalAlign='middle'>
                    <Grid.Column style={{maxWidth: 450}}>
                        <Form size='large'>
                            <Segment stacked>
                                <Form.Input
                                    fluid icon='user'
                                    iconPosition='left'
                                    placeholder='아이디'
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='비밀번호'
                                    type='password'
                                />
                                <Button color='teal' fluid size='large'>
                                    로그인
                                </Button>
                            </Segment>
                        </Form>
                        <Message>
                            아이디 / 비밀번호를 잊으셨나요?
                            <Button color='teal' fluid size='large'>
                                아이디 / 비밀번호 찾기
                            </Button>
                        </Message>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default Login;