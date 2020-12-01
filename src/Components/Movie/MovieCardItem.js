import React from 'react'
import {Link} from "react-router-dom"
import {Image, Card} from "semantic-ui-react"

// 영화 카드를 만드는 컴포넌트 입니다.
class MovieCardItem extends React.Component {
    render() {
        return (
            <Card relaxed centered style={{margin: "10px"}} size='small'>
                <Image as={Link} to={'/movieinfo?movie_id=' + this.props.movie_id}
                       src={this.props.img_url}
                       wrapped ui={false}/>
                {/* MovieListPage 에서 props 로 넘겨받은 movie_id로 */}
                {/* 카드의 이미지를 클릭하였을 때, 해당하는 movie_id의 정보를 출력하는 페이지로 이동합니다. */}
                <Card.Content>
                    <Card.Header><p style={{fontSize: 20}}>{this.props.name}</p></Card.Header>
                    {/* MovieListPage 에서 props 로 넘겨받은 name 으로 영화 이름을 출력합니다. */}
                </Card.Content>
            </Card>
        )
    }
}

export default MovieCardItem