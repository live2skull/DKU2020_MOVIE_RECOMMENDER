import React from "react";
import {Form, Button} from "semantic-ui-react";

class Login extends React.Component {
    render() {
        return(
            <Form>
                <Form.Field>
                    <label>아이디</label>
                    <input placeholder='ID' />
                </Form.Field>
                <Form.Field>
                    <label>비밀번호</label>
                    <input placeholder='PASSWORD' />
                </Form.Field>
                <Button type='submit'>로그인</Button>
            </Form>
        )
    }
}

export default Login;