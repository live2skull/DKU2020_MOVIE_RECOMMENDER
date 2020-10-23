import React from "react";
import {Menu} from "semantic-ui-react";
import {Link} from 'react-router-dom';

class Topbar1 extends React.Component {
    state = {}

    handleItemClick = (e, {name}) => this.setState({activeItem: name})
    render() {
        const {activeItem} = this.state

        return (
            <Menu size='massive' style={{marginBottom: 0}}>
                <Link to='/'>
                    <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        onClick={this.handleItemClick}
                    >
                        <h1>영화보러갈래</h1>
                    </Menu.Item>
                </Link>

                <Menu.Menu position='right'>


                    <Menu.Item as={Link} to='/login'
                               name='login'
                               active={activeItem === 'login'}
                               onClick={this.handleItemClick}
                    >
                        <h3>로그인</h3>
                    </Menu.Item>


                    <Menu.Item as={Link} to='/signup'
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