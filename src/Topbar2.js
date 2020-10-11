import React from "react";
import {Input, Menu} from "semantic-ui-react";
import Categories from "./Categories";

class Topbar2 extends React.Component {
    render() {
        return (
            <Menu size='medium' style={{marginTop:0}}>
                <Menu.Item>
                    <Categories/>
                </Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item fitted='vertically'>
                        <Input transparent icon='search' placeholder='검색할 영화 이름을 입력하세요' style={{width: 400}}/>
                        {/*Input에 onClick 속성 추가 필요*/}
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }
}

export default Topbar2;