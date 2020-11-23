import React from "react";
import {Segment, Header, Image, Rating, Sticky} from "semantic-ui-react";
import Topbar from "../Menu/Topbar";
import UserComment from "../Comment/UserComment"
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
                <Loading/>
            )
        }

        if (movie.score == null) {
            movie.score = 0
        }

        return (
            <div>
                <Sticky>
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
                                    평점 : {parseFloat(movie.score).toFixed(2)} <Rating icon='star'
                                                                              defaultRating={(parseFloat(movie.score)).toFixed(2)}
                                                                              maxRating={10} disabled/>
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
                    <UserComment movie_id={movie.id}/>
                </Segment.Group>
            </div>
        )
    }
}

export default MovieInfo;