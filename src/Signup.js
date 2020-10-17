import React from "react";
import {Form, Button, Segment, Message, Grid} from "semantic-ui-react";
import Topbar1 from "./Topbar1";

class Signup extends React.Component {
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
                                    type='id'
                                />
                                <Form.Input
                                    fluid icon='lock'
                                    iconPosition='left'
                                    placeholder='비밀번호'
                                    type='password'
                                />
                                <Form.Input
                                    fluid icon='checkmark'
                                    iconPosition='left'
                                    placeholder='비밀번호확인'
                                    type='checkPassword'
                                />
                                <Form.Input
                                    fluid icon='mail'
                                    iconPosition='left'
                                    placeholder='이메일'
                                    type='email'
                                />
                                <Form.Input
                                    fluid icon='smile outline'
                                    iconPosition='left'
                                    placeholder='닉네임'
                                    type='nickname'
                                />
                                <Button color='teal' fluid size='large'>
                                    가입
                                </Button>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default Signup;