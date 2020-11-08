import React from 'react';
import {Card} from "semantic-ui-react";
import axios from "axios";
import MovieItem from "./MovieItem";
import Loading from "../Decorator/Loading"; // API 연동

class MovieList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movieList: []
        };
    }

    componentDidMount() {
        this._getList();
    }

    _getList() {
        axios.get("/data/movies/")
            .then(data => {
                this.setState({
                    movieList: data.data.results
                });
            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        const items = [];

        {
            this.state.movieList.map(movie => {
                items.push(<MovieItem movie_id={movie.id} name={movie.name} img_url={movie.img_url}/>);
            })
        }

        if (this.state.movieList.length === 0) {
            return (
                <Loading />
            )
        }

        return (
            <Card.Group centered /*itemsPerRow={4}*/>
                {items}
            </Card.Group>
        )

    }
}

export default MovieList;