import React from "react"
import {Loader, Dimmer} from "semantic-ui-react"

// 로딩중 화면을 출력하는 컴포넌트입니다.
class Loading extends React.Component {
    render() {
        return(
            <Dimmer active inverted>
                <Loader active inline='centered'>로딩중</Loader>
            </Dimmer>
        )
    }
}

export default Loading