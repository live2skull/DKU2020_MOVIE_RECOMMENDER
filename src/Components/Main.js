import React from 'react';
import Topbar1 from './Menu/Topbar1';
import Topbar2 from './Menu/Topbar2';
import MovieList from "./Movie/MovieList";

class Main extends React.Component {
    render() {
        return (
            <div>
                <Topbar1/>
                <Topbar2/>
                <MovieList/>
            </div>
        );
    }
}

export default Main;