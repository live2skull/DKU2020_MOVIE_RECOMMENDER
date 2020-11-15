import React from 'react';
import Topbar1 from './Menu/Topbar1';
import Topbar2 from "./Menu/Topbar2";
import MovieList from "./Movie/MovieList";
import {Sticky} from "semantic-ui-react";
import queryString from "query-string";


class MovieListPage extends React.Component {
    constructor(props) {
        super(props);
        const {search} = this.props.location;	// 문자열 형식으로 결과값이 반환된다.
        const queryObj = queryString.parse(search);	// 문자열의 쿼리스트링을 Object로 변환

        const genre_id = queryObj.genre_id || '';
        const title = queryObj.title || '';

        const score_gte = queryObj.score_gte || '';

        // const score_lte = queryObj.score_lte || '';
        this.state ={
            genre_id : genre_id,
            title : title,
            score_gte : score_gte
        }
    }

    render() {
        return (
            <div>
                <Sticky onBottom>
                    <Topbar1/>
                    <Topbar2/>
                </Sticky>
                <MovieList genre_id={this.state.genre_id} title={this.state.title} score_gte={this.state.score_gte}/>
            </div>
        );
    }
}

export default MovieListPage;