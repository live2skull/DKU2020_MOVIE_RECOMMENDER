import React from 'react';
import {Link} from "react-router-dom";
import {Image, Card} from "semantic-ui-react";

class MovieItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card relaxed centered style={{margin: "10px"}} size='medium'>
                <Image as={Link} to={'/movieinfo?movie_id='+ this.props.movie_id}
                       src={this.props.img_url} /*size='small'*/
                       wrapped ui={false}/>
                <Card.Content>
                    <Card.Header><p style={{fontSize: 20}}>{this.props.name}</p></Card.Header>
                </Card.Content>
            </Card>
        )
    }
}

export default MovieItem;