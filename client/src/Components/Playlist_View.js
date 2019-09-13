import React from 'react'
import { Container } from 'semantic-ui-react';

export default class Playlist_View extends React.Component {
    render() {
        const playlist_id = this.props.match.params.playlist_id;
        return (
            <Container>
                <h1>Playlist View: {playlist_id} </h1>
            </Container>
        )
    }
}