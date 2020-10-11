import React from "react";
import {Menu} from "semantic-ui-react";

class Topbar1 extends React.Component {
    state = {}

    handleItemClick = (e, {name}) => this.setState({activeItem: name})

    // 타이틀, 로그인, 회원가입 onClick 속성 추가 필요
    render() {
        const {activeItem} = this.state

        return (
            <Menu size='massive' style={{marginBottom:0}}>
                <Menu.Item
                    name='home'
                    active={activeItem === 'home'}
                    onClick={this.handleItemClick}
                >
                    <h1>영화보러갈래</h1>
                </Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item
                        name='login'
                        active={activeItem === 'login'}
                        onClick={this.handleItemClick}
                    >
                        <h3>로그인</h3>
                    </Menu.Item>

                    <Menu.Item
                        size='large'
                        name='signup'
                        active={activeItem === 'signup'}
                        onClick={this.handleItemClick}
                    >
                        <h3>회원가입</h3>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }
}

export default Topbar1;