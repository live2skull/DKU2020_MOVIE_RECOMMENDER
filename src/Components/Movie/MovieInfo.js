import React from "react";
import {Segment, Header, Image, Rating} from "semantic-ui-react";
import Topbar1 from "../Menu/Topbar1";
import Topbar2 from "../Menu/Topbar2";
import UserComment from "./UserComment"
import Loading from "../Decorator/Loading";
import axios from "axios";
import queryString from "query-string";


class MovieInfo extends React.Component {
    constructor(props) {
        super(props);
        const {search} = this.props.location;	// 문자열 형식으로 결과값이 반환된다.
        const queryObj = queryString.parse(search);	// 문자열의 쿼리스트링을 Object로 변환

        const movie_id = queryObj.movie_id;
        this.state = {
            movie_id: movie_id
        };
    }

    componentDidMount() {
        this._getMovie();
    }

    _getMovie() {
        axios.get("/data/movies/" + this.state.movie_id)
            .then(data => {
                this.setState({
                    movie: data.data
                });
            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        const movie = this.state.movie

        if (this.state.movie == null) {
            return (
                <Loading />
            )
        }

        if (movie.score_avg == null) {
            movie.score_avg = 0
        }

        return (
            <div>
                <Topbar1/>
                <Topbar2/>
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
                                <Header as='h3' style={{fontSize: '1.6em'}}>
                                    평점 : {movie.score_avg.toFixed(2)} <Rating icon='star'
                                                                              defaultRating={(movie.score_avg / 2).toFixed(2)}
                                                                              maxRating={5} disabled/>
                                </Header>
                            </Segment>
                            <Segment>장르 : {movie.genres.map(genre => genre.name).join(", ")} </Segment>
                            {/*<Segment>감독 : 리차드 커티스</Segment>*/}
                            <Segment>출연 : {movie.actors.map(actor => actor.name).join(", ")}</Segment>
                            <Segment>개봉일 : {movie.opened_at}</Segment>
                            <Segment>
                                <p>{movie.description}</p>
                            </Segment>
                        </Segment.Group>
                    </Segment.Group>
                    <UserComment/>
                </Segment.Group>
            </div>
        )
    }
}

export default MovieInfo;