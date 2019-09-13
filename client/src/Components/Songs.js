import React from 'react'
import { Container, Icon, Grid, Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import SongLine from './SongLine';
import _ from 'lodash';

class Songs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            songs: [],
            isSongsLoaded: false
        }
    }

    componentWillMount() {
        // Get the users tags 
        // fetch("http://localhost:9000/api/tags/user/" + this.props.user.id, {
        fetch("http://localhost:9000/api/songs/user/"+ this.props.user.id, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    console.log(json);
                    this.setState({
                        songs: json,
                        isSongsLoaded: true
                    })
                });
            }
        });
    }

    render() {
        if(this.state.isSongsLoaded) {
            if ('message' in this.state.songs) {
                return (
                    <Container>
                        <h1 style={{marginBottom:'20px'}}>Tagged Songs</h1>
                        <p style={{fontSize:'1.25em'}}>No Song has been tagged.</p>
                    </Container>
                )
            }
            const songs = this.state.songs.map((song) =>
                <SongLine key={song.id} song={song}/>
            )
            return (
                <Container>
                    <h1 style={{marginBottom:'20px'}}>Tagged Songs</h1>
                    <Table relaxed inverted textAlign='left'>
                        {songs}
                    </Table>
                </Container>
            )
        }
        else {
            return null;
        }
        
    }
}
function mapStateToProps(state) {
    return { user: state.userProfile }
}


export default connect(mapStateToProps, {})(Songs);