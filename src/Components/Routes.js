import React from 'react';
import MovieListPage from "./MovieListPage";
import Login from './User/Login';
import Signup from "./User/Signup";
import MovieInfo from "./Movie/MovieInfo";
import MovieListPageByFilter from "./MovieListPageByFilter";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Categories from "./Menu/Categories";


class Routes extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/movielistpagebyfilter' component={MovieListPageByFilter} />
                    <Route exact path='/movieinfo' component={MovieInfo} />
                    <Route exact path='/signup' component={Signup} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/' component={MovieListPage} />
                    <Route exact path='/' component={Categories} />
                </Switch>
            </Router>
        );
    }
}

export default Routes;