import React from 'react';
import {Dropdown} from 'semantic-ui-react';
import { withRouter } from "react-router-dom";

const cateoptions = [
    {key: 1, text: "드라마", value: 1},
    {key: 2, text: "판타지", value: 2},
    {key: 3, text: "서부", value: 3},
    {key: 4, text: "공포", value: 4},
    {key: 5, text: "멜로/로맨스", value: 5},
    {key: 6, text: "모험", value: 6},
    {key: 7, text: "스릴러", value: 7},
    {key: 8, text: "느와르", value: 8},
    {key: 9, text: "컬트", value: 9},
    {key: 10, text: "다큐멘터리", value: 10},
    {key: 11, text: "코미디", value: 11},
    {key: 12, text: "가족", value: 12},
    {key: 13, text: "미스터리", value: 13},
    {key: 14, text: "전쟁", value: 14},
    {key: 15, text: "애니메이션", value: 15},
    {key: 16, text: "범죄", value: 16},
    {key: 17, text: "뮤지컬", value: 17},
    {key: 18, text: "SF", value: 18},
    {key: 19, text: "액션", value: 19},
    {key: 20, text: "무협", value: 20},
    {key: 21, text: "에로", value: 21},
    {key: 22, text: "서스펜스", value: 22},
    {key: 23, text: "서사", value: 23},
    {key: 24, text: "블랙코미디", value: 24},
    {key: 25, text: "실험", value: 25},
    {key: 26, text: "공연실황", value: 29}
//     // {key: 1, text: "드라마", value: '1'},
//     // {key: 2, text: "판타지", value: '2'},
//     // {key: 3, text: "서부", value: '3'},
//     // {key: 4, text: "공포", value: '4'},
//     // {key: 5, text: "멜로/로맨스", value: '5'},
//     // {key: 6, text: "모험", value: '6'},
//     // {key: 7, text: "스릴러", value: '7'},
//     // {key: 8, text: "느와르", value: '8'},
//     // {key: 9, text: "컬트", value: '9'},
//     // {key: 10, text: "다큐멘터리", value: '10'},
//     // {key: 11, text: "코미디", value: '11'},
//     // {key: 12, text: "가족", value: '12'},
//     // {key: 13, text: "미스터리", value: '13'},
//     // {key: 14, text: "전쟁", value: '14'},
//     // {key: 15, text: "애니메이션", value: '15'},
//     // {key: 16, text: "범죄", value: '16'},
//     // {key: 17, text: "뮤지컬", value: '17'},
//     // {key: 18, text: "SF", value: '18'},
//     // {key: 19, text: "액션", value: '19'},
//     // {key: 20, text: "무협", value: '20'},
//     // {key: 21, text: "에로", value: '21'},
//     // {key: 22, text: "서스펜스", value: '22'},
//     // {key: 23, text: "서사", value: '23'},
//     // {key: 24, text: "블랙코미디", value: '24'},
//     // {key: 25, text: "실험", value: '25'},
//     // {key: 26, text: "공연실황", value: '29'}
]

class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleChange = (e, {value}) => {
        const path = "/?genre_id=" + value;
        window.location.replace(path); // 참고 : https://geonlee.tistory.com/191
    }
    //
    //
    // componentDidMount() {
    //     this._getGenre();
    // }
    //
    // _getGenre() {
    //     axios.get("/data/genres/?page=" + 1)
    //         .then(data => {
    //             this.setState({
    //                 genrelist1: data.data.results
    //             });
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         });
    //     axios.get("/data/genres/?page=" + 2)
    //         .then(data => {
    //             this.setState({
    //                 genrelist2: data.data.results
    //             });
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         });
    //     axios.get("/data/genres/?page=" + 3)
    //         .then(data => {
    //             this.setState({
    //                 genrelist3: data.data.results
    //             });
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         });
    // }

    render() {
        const {value} = this.state
        // const genres = [];
        // {
        // this.state.genrelist1.map(genre => {
        //     genres.push(<Dropdown.Item as={Link} to ={'/?genre='+genre.id}>{genre.name}</Dropdown.Item>);
        // })
        // this.state.genrelist2.map(genre => {
        //     genres.push(<Dropdown.Item as={Link} to ={'/?genre='+genre.id}>{genre.name}</Dropdown.Item>);
        // })
        // this.state.genrelist3.map(genre => {
        //     genres.push(<Dropdown.Item as={Link} to ={'/?genre='+genre.id}>{genre.name}</Dropdown.Item>);
        // })
        //     this.state.genrelist1.map(genre => {
        //         genres.push(<Dropdown.Item as={Link} to ={'/?genre='+genre.id}>{genre.name}</Dropdown.Item>);
        //     })
        //     this.state.genrelist2.map(genre => {
        //         genres.push(<Dropdown.Item as={Link} to ={'/?genre='+genre.id}>{genre.name}</Dropdown.Item>);
        //
        //     })
        //     this.state.genrelist3.map(genre => {
        //         genres.push(<Dropdown.Item as={Link} to ={'/?genre='+genre.id}>{genre.name}</Dropdown.Item>);
        //
        //     })
        // }

        return (
            <div>
                <Dropdown
                    onChange={this.handleChange}
                    options={cateoptions}
                    placeholder="전체 보기"
                    selection
                    value={value}
                />
            </div>
        );
    }
}

export default withRouter(Categories);