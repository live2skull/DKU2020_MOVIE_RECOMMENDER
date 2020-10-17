import React from 'react';
import Main from './Main';
import Login from './Login';
import Signup from "./Signup";
import Movieinfo from "./Movieinfo";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

class Routes extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/movieinfo' component={Movieinfo} />
                    <Route exact path='/signup' component={Signup} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/' component={Main} />
                </Switch>
            </Router>
        );
    }
}

export default Routes;