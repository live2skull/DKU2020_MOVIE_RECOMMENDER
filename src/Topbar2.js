import React from "react";
import {Input, Menu} from "semantic-ui-react";
import Categories from "./Categories";

class Topbar2 extends React.Component {
    state = {}

    handleItemClick = (e, {name}) => this.setState({activeItem: name})

    render() {
        const {activeItem} = this.state
        return (
            <Menu size='medium' style={{marginTop: 0}}>
                <Menu.Item>
                    <Categories/>
                </Menu.Item>
                <Menu.Menu position='right' >
                    <Menu.Item fitted='vertically'>
                        <Input transparent
                               placeholder='검색할 영화 이름을 입력하세요'
                               style={{width: 400}}
                        />
                        <Menu.Item
                            icon = 'search'
                            active={activeItem === 'search'}
                            onClick={this.handleItemClick}
                        >
                        </Menu.Item>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }
}

export default Topbar2;