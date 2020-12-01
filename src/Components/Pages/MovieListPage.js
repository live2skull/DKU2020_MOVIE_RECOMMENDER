import React from 'react'
import {Card, Dropdown, Form, Loader, Menu, Sticky} from "semantic-ui-react"
import axios from "axios"
import Topbar from "../Menu/Topbar"
import MovieCardItem from "../Movie/MovieCardItem"

// 장르 리스트를 정의합니다.
const categories = [
    {key: 1, text: "전체보기", value: ''},
    {key: 2, text: "드라마", value: 1},
    {key: 3, text: "판타지", value: 2},
    {key: 4, text: "서부", value: 3},
    {key: 5, text: "공포", value: 4},
    {key: 6, text: "멜로/로맨스", value: 5},
    {key: 7, text: "모험", value: 6},
    {key: 8, text: "스릴러", value: 7},
    {key: 9, text: "느와르", value: 8},
    {key: 10, text: "컬트", value: 9},
    {key: 11, text: "다큐멘터리", value: 10},
    {key: 12, text: "코미디", value: 11},
    {key: 13, text: "가족", value: 12},
    {key: 14, text: "미스터리", value: 13},
    {key: 15, text: "전쟁", value: 14},
    {key: 16, text: "애니메이션", value: 15},
    {key: 17, text: "범죄", value: 16},
    {key: 18, text: "뮤지컬", value: 17},
    {key: 19, text: "SF", value: 18},
    {key: 20, text: "액션", value: 19},
    {key: 21, text: "무협", value: 20},
    {key: 22, text: "에로", value: 21},
    {key: 23, text: "서스펜스", value: 22},
    {key: 24, text: "서사", value: 23},
    {key: 25, text: "블랙코미디", value: 24},
    {key: 26, text: "실험", value: 25},
    {key: 27, text: "공연실황", value: 29}
]

// 영화 카드들을 출력하는 페이지 컴포넌트입니다.
class MovieListPage extends React.Component {
    // state 로 영화 리스트(movieList), 영화 리스트 API 페이지 숫자(page_id), 장르(genre_id),
    // 제목(title), 해당 평점이상(score_gte), 로딩(loading)
    state = {
        movieList: [],
        page_id: 1,
        genre_id: '',
        title: '',
        score_gte: '',
        loading: false
    }

    // 카테고리 선택에서 장르를 선택하면 state 의 genre_id 를 변경하는 함수입니다.
    handleChangeGenre = (e, {value}) => {
        this.setState({
            genre_id: value
        })
    }

    // 최소 평점(선택 평점 이상)을 선택하면 state 의 score_gte 를 변경하는 함수입니다.
    handleScoreClick = (e, {index}) => {
        this.setState({
            score_gte: index
        })
    }

    // 검색 텍스트 박스 내 문자를 입력하면 해당 문자를 state 의 title 을 변경하는 함수입니다.
    handleChange = (e) => {
        this.setState({
            title: e.target.value
        })
    }

    // "검색" 버튼을 클릭할 시 실행하는 함수입니다.
    handleSubmit = () => {
        this.setState({
            movieList: [],      // state 의 movieList 를 비웁니다.
            page_id: 1          // state 의 page_id 를 1로 초기화합니다.
        })
        this._getList()         // 다시 _getList 함수를 호출합니다.
    }

    // 컴포넌트가 마운트된 직후, 즉 컴포넌트가 만들어지고 첫 렌더링을 마친 후 실행되는 함수입니다.
    componentDidMount() {
        this._getList()
        window.addEventListener("scroll", this.infiniteScroll)
    }

    // 컴포넌트가 마운트 해제되어 제거되기 직전에 호출하는 함수입니다.
    componentWillUnmount() {
        window.removeEventListener("scroll", this.infiniteScroll)
    }

    // API 의 영화 리스트를 불러오는 기능을 구현한 함수입니다.
    _getList() {
        axios.get("https://api.movie.live2skull.kr/data/movies/"
            + "?page=" + this.state.page_id
            + "&genre=" + this.state.genre_id
            + "&title=" + this.state.title
            + "&score_gte=" + this.state.score_gte
        )
            .then(data => {
                const nextItems = data.data.results;                    // 영화 리스트를 저장하고,
                this.setState({
                    movieList: this.state.movieList.concat(nextItems),  // state 의 movieList 에 concatenate 합니다.
                    loading: false                                      // 영화 리스트를 불러왔으니, state 의 loading 을 false 로 설정합니다.
                })
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    loading: false
                })
            })
    }

    // 무한 스크롤 기능을 구현한 함수입니다.
    infiniteScroll = () => {
        const {documentElement, body} = document
        const scrollHeight = Math.max(documentElement.scrollHeight, body.scrollHeight)
        const scrollTop = Math.max(documentElement.scrollTop, body.scrollTop)
        const clientHeight = documentElement.clientHeight

        if (scrollTop + clientHeight >= scrollHeight) {     // 스크롤이 웹페이지 끝에 도달하면,
            this.setState({
                page_id: this.state.page_id + 1,            // state 의 page_id 에 1을 더합니다.
                loading: true                               // state 의 loading 을 true 로 설정합니다.
            });
            this._getList()                                 // 위에서 설정한 state 상태로 다시 영화 리스트를 불러옵니다.
        }
    }

    render() {
        const list = []

        // state 의 movieList 에 foreach 구문을 적용시켜 원소인 movie 마다 해당하는 props 를 MovieCardItem 에 넘긴 결과를
        // list 의 원소로 추가합니다.
        // eslint-disable-next-line array-callback-return
        this.state.movieList.map(movie => {
            list.push(<MovieCardItem movie_id={movie.id} name={movie.name} img_url={movie.img_url}/>)
        })

        return (
            <div>
                <Sticky onBottom>
                    <Topbar/>
                    <Menu size='medium' style={{marginTop: 0}} borderless>
                        <Menu.Item>
                            <Dropdown
                                onChange={this.handleChangeGenre}
                                options={categories}
                                placeholder='장르 선택'
                                selection
                                value={this.state.genre_id}
                            />
                        </Menu.Item>

                        <Menu.Item
                            name='최소 평점 선택'
                        />

                        <Menu.Item
                            name='모든 평점'
                            index=''
                            active={this.state.score_gte === ''}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='1'
                            index='1'
                            active={this.state.score_gte === '1'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='2'
                            index='2'
                            active={this.state.score_gte === '2'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='3'
                            index='3'
                            active={this.state.score_gte === '3'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='4'
                            index='4'
                            active={this.state.score_gte === '4'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='5'
                            index='5'
                            active={this.state.score_gte === '5'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='6'
                            index='6'
                            active={this.state.score_gte === '6'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='7'
                            index='7'
                            active={this.state.score_gte === '7'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='8'
                            index='8'
                            active={this.state.score_gte === '8'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='9'
                            index='9'
                            active={this.state.score_gte === '9'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='10'
                            index='10'
                            active={this.state.score_gte === '10'}
                            onClick={this.handleScoreClick}
                        />

                        <Menu.Menu>
                            <Menu.Item fitted='vertically'>
                                <Form onSubmit={this.handleSubmit} widths='equal'>
                                    <Form.Group style={{margin: 0}}>
                                        <Form.Input
                                            placeholder='영화 제목을 입력하세요'
                                            value={this.state.title}
                                            onChange={this.handleChange}
                                        />
                                        <Form.Button content='검색'/>
                                    </Form.Group>
                                </Form>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>
                </Sticky>
                <Card.Group centered itemsPerRow={5}>
                    {list}
                </Card.Group>
                <br/>
                {
                    list.length === 0 && this.state.movieList.length === 0 ?
                        <div>
                            <br/>
                            <p style={{textAlign: "center"}}>검색된 결과가 없습니다 ..</p>
                        </div>
                        :
                        null
                }
                {/* 삼항 연산자로 해당 영화리스트(list)에 정보가 없고, state 의 movieList 에도 정보가 없으면 검색된 결과가 없다는 문구를 출력합니다. */}
                {
                    this.state.loading ?
                        <div>
                            <br/>
                            <Loader active inline='centered'>영화 목록을 가져오는중 ..</Loader>
                        </div>
                        :
                        null
                }
                {/* state 의 loading 이 true, 즉 로딩중이면, 영화 목록을 가져오는 중이라는 문구를 출력합니다. */}
            </div>
        )
    }
}

export default MovieListPage