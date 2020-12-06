import React from "react"
import {Segment, Header, Image, Rating, Sticky} from "semantic-ui-react"
import axios from "axios"
import Topbar from "../Menu/Topbar"
import Comments from "../Comment/Comments"
import Loading from "../Decorator/Loading"
import queryString from "query-string"

// 영화 정보를 출력하는 페이지 컴포넌트입니다.
class MovieInfoPage extends React.Component {
    constructor(props) {
        super(props)

        const {search} = this.props.location
        const queryObj = queryString.parse(search)  // 문자열 형식으로 결과값이 반환됩니다.
        const movie_id = queryObj.movie_id          // 문자열의 쿼리스트링을 Object로 변환됩니다.

        this.state = {
            movie_id: movie_id
        }
    }

    // 컴포넌트가 마운트된 직후, 즉 컴포넌트가 만들어지고 첫 렌더링을 마친 후 실행되는 함수를 설정합니다.
    componentDidMount() {
        this._getMovieInfo()
    }

    // API 의 영화 하나의 정보를 출력하는 기능을 구현한 함수입니다.
    _getMovieInfo() {
        axios.get("https://api.movie.live2skull.kr/data/movies/" + this.state.movie_id)
            .then(data => {
                this.setState({
                    movie: data.data    // movie 자체를 state로 설정합니다.
                })
            })
            .catch(error => {
                console.log(error)
            })
    }

    render() {
        const movie = this.state.movie

        // 만약 영화 정보를 가져오지 못하였을 때, 또는 정보를 가져올 때 오래걸린다면 로딩화면을 출력합니다.
        if (this.state.movie == null) {
            return (
                <Loading/>
            )
        }

        // 네이버 영화에서 평점을 출력해주지 않은 영화를 가져왔을때, 평점을 0점으로 설정합니다.
        if (movie.score == null) {
            movie.score = 0
        }

        return (
            <div>
                <Sticky onBottom>
                    <Topbar/>
                </Sticky>
                <Segment.Group>
                    <Segment.Group horizontal>
                        <Image bordered rounded size='medium' src={movie.img_url}/>
                        <Segment.Group vertical>
                            <Segment>
                                <Header as='h3' style={{fontSize: '1.6em'}}>
                                    영화 제목 : {movie.name}
                                </Header>
                            </Segment>
                            <Segment>
                                <Header as='h3' style={{fontSize: '1.4em'}}>
                                    평점 : {parseFloat(movie.score).toFixed(2)}
                                    <Rating icon='star'
                                            defaultRating={(parseFloat(movie.score)).toFixed(2)}
                                            maxRating={10} disabled
                                    />
                                </Header>
                            </Segment>
                            <Segment>장르 : {movie.genres.map(genre => genre.name).join(", ")} </Segment>
                            <Segment>출연 : {movie.actors.map(actor => actor.name).join(", ")}</Segment>
                            <Segment>개봉일 : {movie.opened_at}</Segment>
                            <Segment>
                                <p>{movie.description}</p>
                            </Segment>
                        </Segment.Group>
                    </Segment.Group>
                    <Comments movie_id={movie.id}/>
                </Segment.Group>
            </div>
        )
    }
}

export default MovieInfoPage