import React from 'react';
import {Grid, Image} from "semantic-ui-react";
import defaultimg from "./default.jpg";
import eximage from "./ex_image.jpg";
import {Link} from "react-router-dom";

// 백엔드와 연동 필요
// 임시로 만들어둠
class Movielist extends React.Component {
    render() {
        return (
            <Grid relaxed centered style={{margin: "auto"}}>
                <Grid.Row columns={4} centered>
                    <Grid.Column>
                        <Grid.Row centered>
                            <Image
                                as={Link} to='/movieinfo'
                                src={eximage} size='medium'
                            />
                        </Grid.Row>
                        <Grid.Row>
                            <p style={{fontSize:20}}>어바웃타임</p>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column>
                        <Image src={defaultimg} size='medium'/>
                        <p>Title</p>
                    </Grid.Column>
                    <Grid.Column>
                        <Image size='medium' src={defaultimg}/>
                        <p>Title</p>
                    </Grid.Column>
                    <Grid.Column>
                        <Image size='medium' src={defaultimg}/>
                        <p>Title</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default Movielist;