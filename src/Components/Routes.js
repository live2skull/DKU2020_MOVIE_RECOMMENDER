import React from 'react';
import MainPage from "./MainPage";
import Login from './User/Login';
import Signup from "./User/Signup";
import UserInfo from "./User/UserInfo";
import MovieInfo from "./Movie/MovieInfo";
import MovieListPage from "./Movie/MovieListPage";
import RecommendedMovieList from "./Movie/RecommendedMovieList";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

class Routes extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/recommendedmovie' component={RecommendedMovieList} />
                    <Route exact path='/movielistpage' component={MovieListPage} />
                    <Route exact path='/movieinfo' component={MovieInfo} />
                    <Route exact path='/signup' component={Signup} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/userinfo' component={UserInfo} />
                    <Route exact path='/' component={MainPage} />
                </Switch>
            </Router>
        );
    }
}

export default Routes;