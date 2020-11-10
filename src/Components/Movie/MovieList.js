import React from 'react';
import {Card, Loader} from "semantic-ui-react";
import axios from "axios";
import MovieItem from "./MovieItem";
import Loading from "../Decorator/Loading"; // API 연동

class MovieList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movieList: [],
            page_id: 1,
            loading: false
        };
    }

    componentDidMount() {
        this._getList();
        window.addEventListener("scroll", this.infiniteScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.infiniteScroll);
    }

    _getList() {
        axios.get("/data/movies/?page=" + this.state.page_id)
            .then(data => {
                const nextItems = data.data.results;
                this.setState({
                    movieList: this.state.movieList.concat(nextItems),
                    loading: true
                });
            })
            .catch(error => {
                console.log(error)
            });
    }

    infiniteScroll = () => {
        const {documentElement, body} = document;

        const scrollHeight = Math.max(documentElement.scrollHeight, body.scrollHeight);
        const scrollTop = Math.max(documentElement.scrollTop, body.scrollTop);
        const clientHeight = documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) {
            this.setState({
                page_id: this.state.page_id + 1,
                loading: false
            });
            this._getList();
        }
    };

    render() {
        const items = [];

        {
            this.state.movieList.map(movie => {
                items.push(<MovieItem movie_id={movie.id} name={movie.name} img_url={movie.img_url}/>);
            })
        }

        if (this.state.movieList.length === 0) {
            return (
                <Loading/>
            )
        }

        if (this.state.loading) {
            return (
                <div>
                    <Card.Group centered itemsPerRow={5}>
                        {items}
                    </Card.Group>
                    <br/>
                        <Loader active inline='centered'>로딩중</Loader>
                </div>
            )

        }

        return (
            <Card.Group centered itemsPerRow={5}>
                {items}
            </Card.Group>
        )

    }
}

export default MovieList;