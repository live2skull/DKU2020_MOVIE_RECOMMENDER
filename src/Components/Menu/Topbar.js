import React from "react";
import {Menu} from "semantic-ui-react";
import {Link} from 'react-router-dom';
import axios from "axios";

class Topbar extends React.Component {
    _logout() {
        axios.post("/data/users/logout", {}, {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}})
            .then((response) => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("nickname");
                    window.location.reload();
                }
            ).catch(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("nickname");
                window.location.reload();
            }
        )
    }

    render() {

        return (
            <Menu size='massive' style={{marginBottom: 0}}>
                <Menu.Item
                    as={Link}
                    to='/'
                    name='home'
                    onClick={this.handleItemClick}
                >
                    <h1>영화보러갈래</h1>
                </Menu.Item>

                <Menu.Item
                    as={Link}
                    to='/movielistpage'
                    name='movielist'
                    onClick={this.handleItemClick}
                >
                    <h2>영화 검색</h2>
                </Menu.Item>

                <Menu.Item
                    as={Link}
                    to='/recommendedmovie'
                    name='recommend'
                    onClick={this.handleItemClick}
                >
                    <h2>맞춤 추천</h2>
                </Menu.Item>

                {localStorage.getItem("token") === null ?
                    <Menu.Menu position='right'>
                        <Menu.Item as={Link} to='/login'
                                   name='login'
                                   onClick={this.handleItemClick}
                        >
                            <h3>로그인</h3>
                        </Menu.Item>
                        <Menu.Item as={Link} to='/signup'
                                   size='large'
                                   name='signup'
                                   onClick={this.handleItemClick}
                        >
                            <h3>회원가입</h3>
                        </Menu.Item>
                    </Menu.Menu>
                    :
                    <Menu.Menu position='right'>
                        <Menu.Item as={Link} to='/userinfo'
                                   name='userinfo'
                                   onClick={this.handleItemClick}
                        >
                            <h3>내 정보</h3>
                        </Menu.Item>
                        <Menu.Item
                            as={Link} to='/'
                            name='logout'
                            onClick={this._logout}
                        >
                            <h3>로그아웃</h3>
                        </Menu.Item>
                    </Menu.Menu>
                }
            </Menu>
        )
    }
}

export default Topbar;