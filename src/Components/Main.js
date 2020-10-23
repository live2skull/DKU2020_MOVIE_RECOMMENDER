import React from 'react';
import Topbar1 from './Menu/Topbar1';
import Topbar2 from './Menu/Topbar2';
import Movielist from "./Movie/Movielist";

class Main extends React.Component {
    render() {
        return (
            <div>
                <Topbar1/>
                <Topbar2/>
                <Movielist/>
            </div>
        );
    }
}

export default Main;