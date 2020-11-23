import React from 'react';
import {Card, Loader, Sticky} from "semantic-ui-react";
import axios from "axios";
import MovieItem from "./MovieItem";
import Topbar from "../Menu/Topbar";

class RecommendedMovieList extends React.Component {
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
        if(localStorage.getItem("token") == null){
            alert("로그인 후 이용해주세요 !");
            this.props.history.push('/login');
        }

        axios.get("http://api.movie.live2skull.kr:9090/data/recommends", {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}}
        )
            .then(data => {
                this.setState({
                    movieList: data.data
                });
            })
            .catch(error => {
                console.log(error)
            });
    }

    render() {
        const items = [];

        // eslint-disable-next-line array-callback-return
        this.state.movieList.map(movie => {
            items.push(<MovieItem movie_id={movie.id} name={movie.name} img_url={movie.img_url}/>);
        })

        if (this.state.movieList.length === 0) {
            return (
                <div>
                    <Topbar/>
                    <Loader active inline='centered'>추천중 입니다</Loader>
                </div>
            )
        }

        return (
            <div>
                <Sticky onBottom>
                    <Topbar/>
                </Sticky>
                <Card.Group centered itemsPerRow={5}>
                    {items}
                </Card.Group>
            </div>
        )
    }
}

export default RecommendedMovieList;