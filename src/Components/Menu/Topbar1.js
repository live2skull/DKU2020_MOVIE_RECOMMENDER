import React from "react";
import {Menu} from "semantic-ui-react";
import {Link} from 'react-router-dom';
import axios from "axios";

class Topbar1 extends React.Component {
    _logout() {
        axios.post("/data/users/logout", {}, {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}})
            .then((response) => {
                    localStorage.removeItem("token");
                    window.location.reload();
                }
            ).catch(() => {
                localStorage.removeItem("token");
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
                    to='/movielistpagebyfilter'
                    name='filter'
                    onClick={this.handleItemClick}
                >
                    <h2>상세검색페이지</h2>
                </Menu.Item>

                <Menu.Menu position='right'>

                    {localStorage.getItem("token") === null ?
                        <Menu.Item as={Link} to='/login'
                                   name='login'
                                   onClick={this.handleItemClick}
                        >
                            <h3>로그인</h3>
                        </Menu.Item> :
                        <Menu.Item
                            name='logout'
                            onClick={this._logout}
                        >
                            <h3>로그아웃</h3>
                        </Menu.Item>
                    }

                    <Menu.Item as={Link} to='/signup'
                               size='large'
                               name='signup'
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