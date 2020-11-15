import React from "react";
import {Menu, Form} from "semantic-ui-react";
import Categories from "./Categories";

class Topbar2 extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit.bind(this);
        this.state = {
            title: '',
            activeScore: ''
        }
    }

    handleScoreClick = (e,{name}) => {
        this.setState({
            activeScore : name
        })
    }

    handleFilterClick = (e) => {
        const path = "/?score_gte=" + this.state.activeScore;
        window.location.replace(path); // 참고 : https://geonlee.tistory.com/191
    }

    handleChange = (e) => {
        this.setState({
            title: e.target.value
        })
    }

    handleSubmit = () => {
        const path = "/?title=" + this.state.title;
        window.location.replace(path); // 참고 : https://geonlee.tistory.com/191
    }

    render() {

        return (
            <Menu size='medium' style={{marginTop: 0}} borderless>
                <Menu.Item>
                    <Categories/>
                </Menu.Item>
                <Menu.Item
                    name='1'
                    active={this.state.activeScore === '1'}
                    onClick={this.handleScoreClick}
                />
                <Menu.Item
                    name='2'
                    active={this.state.activeScore === '2'}
                    onClick={this.handleScoreClick}
                />
                <Menu.Item
                    name='3'
                    active={this.state.activeScore === '3'}
                    onClick={this.handleScoreClick}
                />
                <Menu.Item
                    name='4'
                    active={this.state.activeScore === '4'}
                    onClick={this.handleScoreClick}
                />
                <Menu.Item
                    name='5'
                    active={this.state.activeScore === '5'}
                    onClick={this.handleScoreClick}
                />
                <Menu.Item
                    name='6'
                    active={this.state.activeScore === '6'}
                    onClick={this.handleScoreClick}
                />
                <Menu.Item
                    name='7'
                    active={this.state.activeScore === '7'}
                    onClick={this.handleScoreClick}
                />
                <Menu.Item
                    name='8'
                    active={this.state.activeScore === '8'}
                    onClick={this.handleScoreClick}
                />
                <Menu.Item
                    name='9'
                    active={this.state.activeScore === '9'}
                    onClick={this.handleScoreClick}
                />
                <Menu.Item
                    name='10'
                    active={this.state.activeScore === '10'}
                    onClick={this.handleScoreClick}
                />
                <Menu.Item
                    name='선택 평점 이상'
                    onClick={this.handleFilterClick}
                />
                <Menu.Menu position='right'>
                    <Menu.Item fitted='vertically'>
                        <Form onSubmit={this.handleSubmit.bind(this)} widths='equal'>
                            <Form.Group style={{margin:0}}>
                                <Form.Input
                                    placeholder='영화 제목을 입력하세요'
                                    value={this.state.title}
                                    onChange={this.handleChange.bind(this)}
                                />
                                <Form.Button content='찾기'/>
                            </Form.Group>
                        </Form>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }
}

export default Topbar2;