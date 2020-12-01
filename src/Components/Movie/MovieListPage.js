import React from 'react';
import {Card, Dropdown, Form, Loader, Menu, Sticky} from "semantic-ui-react";
import axios from "axios";
import MovieItem from "./MovieItem";
import Topbar from "../Menu/Topbar";

const cateoptions = [
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

class MovieListPage extends React.Component {
    state = {
        movieList: [],
        page_id: 1,
        genre_id: '',
        title: '',
        score_gte: '',
        loading: false
    };

    handleChangeGenre = (e, {value}) => {
        this.setState({
            genre_id: value
        })
    }

    handleScoreClick = (e, {index}) => {
        this.setState({
            score_gte: index
        })
    }

    handleChange = (e) => {
        this.setState({
            title: e.target.value
        })
    }

    handleSubmit = () => {
        this.setState({
            movieList: [],
            page_id: 1
        })
        this._getList();
    }

    componentDidMount() {
        this._getList();
        window.addEventListener("scroll", this.infiniteScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.infiniteScroll);
    }

    _getList() {
        axios.get("https://api.movie.live2skull.kr/data/movies/?page=" + this.state.page_id
            + "&genre=" + this.state.genre_id
            + "&title=" + this.state.title
            + "&score_gte=" + this.state.score_gte
            + "&score_lte=" /*+ this.props.score_gte*/)
            .then(data => {
                const nextItems = data.data.results;
                this.setState({
                    movieList: this.state.movieList.concat(nextItems),
                    loading: false
                })
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    loading: false
                })
            })

    }

    infiniteScroll = () => {
        const {documentElement, body} = document;

        const scrollHeight = Math.max(documentElement.scrollHeight, body.scrollHeight);
        const scrollTop = Math.max(documentElement.scrollTop, body.scrollTop);
        const clientHeight = documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) {
            this.setState({
                page_id: this.state.page_id + 1,
                loading: true
            });
            this._getList();
        }
    };

    render() {
        const items = [];

        // eslint-disable-next-line array-callback-return
        this.state.movieList.map(movie => {
            items.push(<MovieItem movie_id={movie.id} name={movie.name} img_url={movie.img_url}/>);
        })


        return (
            <div>
                <Sticky onBottom>
                    <Topbar/>
                    <Menu size='medium' style={{marginTop: 0}} borderless>
                        <Menu.Item>
                            <Dropdown
                                onChange={this.handleChangeGenre}
                                options={cateoptions}
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
                            index = ''
                            active={this.state.score_gte === ''}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='1'
                            index = '1'
                            active={this.state.score_gte === '1'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='2'
                            index = '2'
                            active={this.state.score_gte === '2'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='3'
                            index = '3'
                            active={this.state.score_gte === '3'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='4'
                            index = '4'
                            active={this.state.score_gte === '4'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='5'
                            index = '5'
                            active={this.state.score_gte === '5'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='6'
                            index = '6'
                            active={this.state.score_gte === '6'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='7'
                            index = '7'
                            active={this.state.score_gte === '7'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='8'
                            index = '8'
                            active={this.state.score_gte === '8'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='9'
                            index = '9'
                            active={this.state.score_gte === '9'}
                            onClick={this.handleScoreClick}
                        />
                        <Menu.Item
                            name='10'
                            index = '10'
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
                    {items}
                </Card.Group>
                <br/>
                {
                    items.length === 0 && this.state.movieList.length === 0 ?
                        <div>
                            <br/>
                            <p style={{textAlign:"center"}}>검색된 결과가 없습니다 ..</p>
                        </div>
                        :
                        null
                }
                {
                    this.state.loading ?
                        <div>
                            <br/>
                            <Loader active inline='centered'>영화 목록을 가져오는중 ..</Loader>
                        </div>
                        :
                        null
                }

            </div>
        )

    }
}


export default MovieListPage;