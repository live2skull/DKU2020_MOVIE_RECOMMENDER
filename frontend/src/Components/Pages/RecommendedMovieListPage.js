import React from 'react'
import {Card, Loader, Sticky} from "semantic-ui-react"
import axios from "axios"
import Topbar from "../Menu/Topbar"
import MovieCardItem from "../Movie/MovieCardItem"

// 영화 추천 페이지 컴포넌트입니다.
class RecommendedMovieListPage extends React.Component {
    // state 로 r_movieList
    constructor(props) {
        super(props)
        this.state = {
            r_movieList: []
        }
    }

    // 컴포넌트가 마운트된 직후, 즉 컴포넌트가 만들어지고 첫 렌더링을 마친 후 실행되는 함수입니다.
    componentDidMount() {
        this._getRecommendedList()
    }

    // API 의 추천된 영화 리스트를 불러오는 기능을 구현한 함수입니다.
    _getRecommendedList() {
        // localStorage 에 토큰이 없다면, 즉 로그인이 되어있지 않다면 alert 후 로그인 페이지로 이동합니다.
        if (localStorage.getItem("token") == null) {
            alert("로그인 후 이용해주세요 !")
            this.props.history.push('/login')
        }

        axios.get("https://api.movie.live2skull.kr/data/recommends",
            {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}}
        )
            .then(data => {
                this.setState({
                    r_movieList: data.data
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        const r_list = [];

        // state 의 r_movieList 에 foreach 구문을 적용시켜 원소인 movie 마다 해당하는 props 를 MovieCardItem 에 넘긴 결과를
        // r_list 의 원소로 추가합니다.
        // eslint-disable-next-line array-callback-return
        this.state.r_movieList.map(movie => {
            r_list.push(<MovieCardItem movie_id={movie.id} name={movie.name} img_url={movie.img_url}/>)
        })

        // 추천 기능을 이용할 조건이 충족되지 않았거나, 추천 기능 작동의 소요 시간이 오래 걸려
        // 리스트가 불려오지 않았을 때 아래 문구를 출력합니다.
        if (this.state.r_movieList.length === 0) {
            return (
                <div>
                    <Topbar/>
                    <br/>
                    <Loader active inline='centered'>
                        <b>*2개 이상 5개 이하*</b> 영화에서 평점과 댓글을 남겨야 하며<br/>
                        조건이 충족되었다면 10초 이내에 결과가 나타납니다.<br/>
                        추천리스트 가져오는 중..
                    </Loader>
                </div>
            )
        }

        return (
            <div>
                <Sticky onBottom>
                    <Topbar/>
                </Sticky>
                <Card.Group centered itemsPerRow={5}>
                    {r_list}
                </Card.Group>
            </div>
        )
    }
}

export default RecommendedMovieListPage