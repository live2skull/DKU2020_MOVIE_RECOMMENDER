import React from 'react';
import Topbar1 from './Topbar1';
import Topbar2 from './Topbar2';
import Movielist from "./Movielist";

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