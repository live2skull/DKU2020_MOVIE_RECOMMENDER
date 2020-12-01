import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import MainPage from "./Pages/MainPage"
import LoginPage from './Pages/LoginPage'
import SignupPage from "./Pages/SignupPage"
import UserInfoPage from "./Pages/UserInfoPage"
import MovieInfoPage from "./Pages/MovieInfoPage"
import MovieListPage from "./Pages/MovieListPage"
import RecommendedMovieListPage from "./Pages/RecommendedMovieListPage"

// 각 페이지의 경로(주소)를 설정하는 컴포넌트입니다.
class Routes extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={MainPage}/>
                    <Route exact path='/login' component={LoginPage}/>
                    <Route exact path='/signup' component={SignupPage}/>
                    <Route exact path='/movies' component={MovieListPage}/>
                    <Route exact path='/userinfo' component={UserInfoPage}/>
                    <Route exact path='/movieinfo' component={MovieInfoPage}/>
                    <Route exact path='/recommendedmovies' component={RecommendedMovieListPage}/>
                </Switch>
            </Router>
        )
    }
}

export default Routes