import React from "react";
import {Loader, Dimmer} from "semantic-ui-react";

class Loading extends React.Component {
    render() {
        return(
            <Dimmer active inverted>
                <Loader active inline='centered'>로딩중</Loader>
            </Dimmer>
        )
    }
}

export default Loading;