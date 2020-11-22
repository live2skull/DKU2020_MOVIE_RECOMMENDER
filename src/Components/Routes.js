import React from 'react';
import MovieListPage from "./MovieListPage";
import Login from './User/Login';
import Signup from "./User/Signup";
import MovieInfo from "./Movie/MovieInfo";
import MovieListPageByFilter from "./MovieListPageByFilter";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

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

                </Switch>
            </Router>
        );
    }
}

export default Routes;