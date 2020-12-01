import React from "react"
import {Menu} from "semantic-ui-react"
import {Link} from 'react-router-dom'
import axios from "axios"

// 모든 페이지에서 상단에 위치하는 바 를 출력하는 컴포넌트입니다.
class Topbar extends React.Component {
    // API 의 로그아웃 기능을 구현한 함수입니다.
    _logout() {
        axios.post("https://api.movie.live2skull.kr/data/users/logout",
            {}, {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}})
            .then((response) => {
                    localStorage.removeItem("token")
                    localStorage.removeItem("nickname")
                    window.location.reload()
                }
            ).catch(() => {
                localStorage.removeItem("token")
                localStorage.removeItem("nickname")
                window.location.reload()
                // 만약 로그아웃에 오류가 나더라도 localStorage 에 저장된 token 과 nickname 을 제거합니다.
            }
        )
    }

    render() {
        return (
            // Menu.Item 들은 각각 Route.js 에서 설정한 주소로 이동하도록 설정합니다.
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
                    to='/movies'
                    name='movielist'
                    onClick={this.handleItemClick}
                >
                    <h2>영화 검색</h2>
                </Menu.Item>

                <Menu.Item
                    as={Link}
                    to='/recommendedmovies'
                    name='recommendedmovielist'
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
                        {/* 삼항 연산자를 사용하여 localStorage 에 token 이 있을 경우, 없을 경우
                        즉, 로그인 상태인지 로그아웃 상태인지에 따라서 출력하는 Menu.Item 이 다르도록 합니다. */}
                    </Menu.Menu>
                }
            </Menu>
        )
    }
}

export default Topbar