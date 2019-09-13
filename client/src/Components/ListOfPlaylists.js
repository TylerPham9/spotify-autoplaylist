import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import {Button, Container, Grid, Image, Table} from 'semantic-ui-react';
import {loggedOut,removeUser} from '../Redux/actions';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";
import PlaylistDisplay from './PlaylistDisplay'
import Player from './Player'
import playlistDefaultIcon from './playlistDefaultIcon.png'



var spotifyApi = new SpotifyWebApi();



class ListOfPlaylists extends React.Component {

	constructor(props) {
	        super(props);
	        spotifyApi.setAccessToken(props.user.accessToken);
	        this.getPlaylist = this.getPlaylist.bind(this);
	        this.playPlaylist = this.playPlaylist.bind(this);
	        this.getCurrentPlayback = this.getCurrentPlayback.bind(this);
	        this.state = { data : [],
	        			   deviceid: '',
	        			 };
	    }

	getPlaylist (){
	    spotifyApi.getUserPlaylists(this.props.user.userName)
	            .then((data) => {
	                var playlistDataArray = [];
	                var playlistItems = data.items;
	                playlistItems.forEach(function (playlist) {
	                	var plImage;
	                	if(playlist.images.length == 0){plImage = playlistDefaultIcon}
	                	else{plImage = playlist.images[0].url}
	                    playlistDataArray.push({ 
	                    	id: playlist.id,                       
	                        name: playlist.name,
	                        total_tracks: playlist.tracks.total,
	                        playlist_image: plImage,                        
	                    })
	                });
	                this.setState({data: playlistDataArray});
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

	playPlaylist(playlistID){
		var device_id = JSON.stringify(this.getCurrentPlayback());
	        fetch("https://api.spotify.com/v1/me/player/play", {
	            method: "PUT",
	            headers: {
	                authorization: `Bearer ${this.props.user.accessToken}`,
	                "Content-Type": "application/json",
	            },
	            body: JSON.stringify({
	                "context_uri": "spotify:playlist:"+playlistID,             
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
	this.getPlaylist();
	}

	render() {
		var ComponentStyle = {
        display: 'inline',
        background: 'none',
        color:'white',
        align: 'center',
        padding: '0'
        };
        const colors=['#212121'];


	        return (
	        	<div style={{marginLeft: '5em'}}> 
	        		<h1 style={{color:'white', marginTop: '0.5em'}}> Playlists </h1>
				{colors.map(color => (
	                <Table singleLine fixed color={color} key={color} inverted style={{marginBottom: '3em', width:'auto', display:'inline-block'}}>
	                <Table.Header>
	                    <Table.Row >
						<Table.HeaderCell>	                        
						</Table.HeaderCell>
						<Table.HeaderCell >	                        
						</Table.HeaderCell>
                         <Table.HeaderCell >
                            <h3 style={{fontSize: '1.4em'}}>
                                Playlist Name
                            </h3> 
                        </Table.HeaderCell>
                         <Table.HeaderCell>
                            <h3 style={{fontSize: '1.4em'}}>
                                Songs In Playlist
                            </h3> 
                        </Table.HeaderCell>
	                    </Table.Row>
	                    </Table.Header>
	                    {this.state.data.map(playlistData => (
	                    	<Table.Row >
	                    		 <Table.Cell>
		                    		<i style={{color: '#1DB954', fontSize: '1.2em', marginLeft: '0.5em'}} class="play icon playlistIcons {playOrPause}" onClick={() => this.playPlaylist(playlistData.id)}> 
		                    		</i>
	                        	</Table.Cell>
	                    		 <Table.Cell>
									<Link to={`/playlist/${playlistData.id}/${playlistData.name}`}> <Image floated='left' size='tiny' style={{height: '3em', width: 'auto'}} src={playlistData.playlist_image} /> </Link>
	                            </Table.Cell>
	                             <Table.Cell>
									<Link to={`/playlist/${playlistData.id}/${playlistData.name}`}> <h4 style={{maxWidth: '40em', fontSize: '1.2em', whiteSpace:'nowrap', overflow: 'hidden',	textOverflow: 'ellipsis', color: '#FFFFFF'}}> {playlistData.name} </h4> </Link>
	                            </Table.Cell>
	                             <Table.Cell textAlign={'center'}>
	                                <h5 > {playlistData.total_tracks} </h5>                        
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

export default connect(mapStateToProps,{loggedOut, removeUser})(ListOfPlaylists);


