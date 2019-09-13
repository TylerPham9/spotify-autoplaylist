import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import {Button, Container, Grid, Table} from 'semantic-ui-react';
import {loggedOut,removeUser} from '../Redux/actions';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactDOM from 'react-dom';


var spotifyApi = new SpotifyWebApi();

class PlaylistDisplay extends React.Component {

    constructor(props) {
        super(props);
        spotifyApi.setAccessToken(props.user.accessToken);
        this.getPlaylistSongs = this.getPlaylistSongs.bind(this);
        this.state = { data : [],
                       deviceid: '',
                       currentlyPlayingID: ''
                    };
    }

    getPlaylistSongs (){
        spotifyApi.getPlaylist(this.props.match.params.playlist_id)
            .then((data) => {
                var playlistDataSongArray = [];
                var playlistSongs = data.tracks.items;
                playlistSongs.forEach(function (playlistTrack) {
                    playlistDataSongArray.push({
                        id: playlistTrack.track.id,                     
                        name: playlistTrack.track.name,
                        artist: playlistTrack.track.artists[0].name,
                        artistID: playlistTrack.track.artists[0].id,
                        album: playlistTrack.track.album.name
                    })
                });
                this.setState({data: playlistDataSongArray});
            });
    }

    getCurrentPlayback(){
            fetch("https://api.spotify.com/v1/me/player", {
                method: "GET",
                headers: {
                    authorization: `Bearer ${this.props.user.accessToken}`,
                    "Content-Type": "application/json",
                },             
            }).then(response => {
                response.json().then(json => {
                    this.setState({deviceid:(json.device.id)});         
               })
            })
    }

    playPlaylistSong(playlistID, songID){
        var device_id = JSON.stringify(this.getCurrentPlayback());
            fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                    authorization: `Bearer ${this.props.user.accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "context_uri": "spotify:playlist:"+playlistID,                
                    "offset": {"uri": "spotify:track:" + songID}
                })
            })
    }

    pauseSong(){
            fetch("https://api.spotify.com/v1/me/player/pause", {
                method: "PUT",
                headers: {
                    authorization: `Bearer ${this.props.user.accessToken}`,
                    "Content-Type": "application/json",
                }            
            })
    }

	componentDidMount() {
	   this.getPlaylistSongs();   
	}

    render() {
            const colors=['#212121'];
        return (
            <div style={{margin: '0em 5em', display:'float', width:'auto'}}>
              <h1 style={{color:'white', marginTop: '1em'}}>{this.props.match.params.playlist_name}</h1> 
                {colors.map(color => (
                    <Table singleLine collapsing fixed color={color} key={color} inverted style={{marginBottom: '3em', marginRight:'4em', width:'auto', display:'inline-block'}}>
                        <Table.Header>
                            <Table.Row >
                            <Table.HeaderCell >
                            </Table.HeaderCell>
                            <Table.HeaderCell >
                                <h3>
                                    Song Name
                                </h3> 
                            </Table.HeaderCell>
                            <Table.HeaderCell >
                                <h3>
                                    Artist
                                </h3> 
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <h3>
                                    Album
                                </h3> 
                            </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        {this.state.data.map(playlistDataSong => (
                            <Table.Row>
                                <Table.Cell>
                                    <i style={{color: '#1DB954', fontSize: '1.2em'}} class="play icon playlistIcons" onClick={() => this.playPlaylistSong(this.props.match.params.playlist_id, playlistDataSong.id)}> 
                                    </i>
                                </Table.Cell>
                                <Table.Cell>
                                    <Link to={`/song/${playlistDataSong.id}`}> <h4 style={{maxWidth:'40em', fontSize: '1.2em', whiteSpace:'nowrap', overflow: 'hidden',textOverflow: 'ellipsis', color: '#FFFFFF'}}> {playlistDataSong.name} </h4> </Link>                           
                                </Table.Cell>
                                <Table.Cell>
                                    <h4 style={{maxWidth:'25em', fontSize: '1.2em', whiteSpace:'nowrap', overflow: 'hidden',textOverflow: 'ellipsis', color: '#FFFFFF'}}>{playlistDataSong.artist}</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    <h4 style={{maxWidth:'25em', fontSize: '1.2em', whiteSpace:'nowrap', overflow: 'hidden',textOverflow: 'ellipsis', color: '#FFFFFF'}}>{playlistDataSong.album} </h4>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                  </Table>
                ))}            
                </div>
        );
    }

}

function mapStateToProps(state) {
    return {user: state.userProfile}
}

export default connect(mapStateToProps,{loggedOut, removeUser})(PlaylistDisplay);
