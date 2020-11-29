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

        axios.get("http://api.movie.live2skull.kr:9090/data/recommends",
            {headers: {'Authorization': `Token ${localStorage.getItem("token")}`}}
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
                    {items}
                </Card.Group>
            </div>
        )
    }
}

export default RecommendedMovieList;