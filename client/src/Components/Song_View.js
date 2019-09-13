import React from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { connect } from 'react-redux';
import TagForm from './TagForm';
import TagList from './TagList';
import _ from 'lodash';
import { Container, Image, Button, Icon, Grid } from 'semantic-ui-react';



const spotifyApi = new SpotifyWebApi();

class Song_View extends React.Component {
    constructor(props) {
        super(props);
        spotifyApi.setAccessToken(props.user.accessToken);
        this.state = {
            song_id: this.props.match.params.song_id,
            song: {},
            isCurrentTagsLoading: true,
            isAllTagsLoading: true,
            isSongLoading: true,
            currentTags: [],
            allTags: [],
        }
        this.postTag = this.postTag.bind(this);
        this.onPlayClick = this.onPlayClick.bind(this);
        this.onPauseClick = this.onPauseClick.bind(this);
        this.postSong = this.postSong.bind(this);
        this.getAllTags = this.getAllTags.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
    }

    async getSongData() {
        const data = await spotifyApi.getTrack(this.state.song_id);
        this.setState({ song: data, isSongLoading: false });
    }
    deleteTag(tagId) {
        const data = {
            tagId: tagId,
            spotifyId: this.state.song_id,
        }
        return fetch('http://localhost:9000/api/taggedsongs/delete', {
            method: "delete",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                this.getCurrentTags();
            }
            else {
                console.log(response.error);
            }

        })
    }

    async getCurrentTags() {
        const fetchURL = 'http://localhost:9000/api/tags/song/' + this.state.song_id;
        const response = await fetch(fetchURL, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        });
        if (response.ok) {
            response.json().then(json => {
                const currentTags = _.map(json, (tag) => ({
                    key: tag.id,
                    text: tag.name,
                    value: tag.name,
                }));
                this.setState({
                    currentTags: currentTags,
                    isCurrentTagsLoading: false,
                });
            });
        }
    }
    async getAllTags() {
        const response = await fetch("http://localhost:9000/api/tags", {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        });
        if (response.ok) {
            response.json().then(json => {
                // Create tag options for tag dropdown menu
                const allTags = _.map(json, (tag) => ({
                    key: tag.id,
                    text: tag.name,
                    value: tag.name,
                }));
                this.setState({
                    allTags: allTags,
                    isAllTagsLoading: false,
                });
            });
        }
    }

    postSong(tagId) {
        // From spotify song data, create a song in db
        const data = {
            name: this.state.song.name,
            artist: this.state.song.artists[0].name,
            album: this.state.song.album.name,
            spotifyId: this.state.song.id,
        }
        fetch("http://localhost:9000/api/songs/create", {
            method: "post",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
            // Get spotify ID
        }).then(responseJson => {
            this.postTaggedSong(responseJson.songData, tagId);
        })
    }

    // Create a tag a song 
    postTaggedSong(songData, tagId) {
        console.log('taggedsond is getting posted');
        const data = {
            songId: songData.id,
            tagId: tagId
        }
        // Creates a tagged song entry, any duplicates will be ignored
        fetch("http://localhost:9000/api/taggedsongs/create", {
            method: "post",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(() => this.getCurrentTags());
    }


    // Create a tag a song 
    postTag(tagValue) {
        const data = {
            userId: this.props.user.id,
            name: tagValue
        }
        // Creates a tagged song entry, any duplicates will be ignored
        fetch("http://localhost:9000/api/tags/create", {
            method: "post",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(responseJson => {
            console.log(responseJson.tag.id);
            this.postSong(responseJson.tag.id);
        })
    }

    onPlayClick() {
        var song_id = this.state.song_id;
        spotifyApi.play({
            uris: ["spotify:track:" + song_id]
        })
    }
    onPauseClick() {
        spotifyApi.pause()
    }

    componentWillMount() {
        Promise.all([
            this.getSongData(),
            this.getAllTags(),
            this.getCurrentTags(),
        ]);
    }


    render() {
        console.log(this.state);

        if (!(this.state.isAllTagsLoading || this.state.isCurrentTagsLoading || this.state.isSongLoading)) {
            if (!('name' in this.state.song)) {
                return (
                    <Container style={{ marginTop: '1em' }}>
                        <h1 style={{ color: 'white' }}>Error: Song is not found</h1>
                    </Container>
                )
            }
            const tagOptions = subtractArrays(this.state.allTags, this.state.currentTags);
            
            return (
                <Container style={{width:'95%', marginTop:'2em', display:'flex'}}>
                        <Image floated='left' size='medium' src={this.state.song.album.images[0].url} style={{marginRight:'50px'}}/>
                        <Container>
                            <h1 style={{color:'white'}}>{this.state.song.name} </h1>
                            <p style={{color:'white', fontSize:'1.2em'}}><strong>Artist:</strong> &nbsp;&nbsp; {this.state.song.artists[0].name}</p>
                            <p style={{color:'white', fontSize:'1.2em'}}><strong>Album:</strong> &nbsp;&nbsp;  {this.state.song.album.name}</p>
                            
                            <strong style={{color:'white', fontSize:'1.2em'}}>Tags: &nbsp;&nbsp;&nbsp;&nbsp;</strong>
                            <TagList currentTags={this.state.currentTags} deleteTag={this.deleteTag}/>
                            <p/>
                            <TagForm tagOptions = {tagOptions}
                                postTag = {this.postTag}
                                postSong = {this.postSong}
                                track={this.state.song} />
                            <p/>
                            <Button icon onClick={() => this.onPlayClick()}>
                                <Icon name='play' size='small'/>
                            </Button>
                            <Button icon onClick={this.onPauseClick}>
                                <Icon name='pause' />
                            </Button>
                        </Container>

                </Container>
            )
        } else {
            return null;
        }
    }
}

function objectsEqual(o1, o2) {
    return o1.key === o2.key;
}

function subtractArrays(a1, a2) {
    var arr = [];
    a1.forEach((o1) => {
        var found = false;
        a2.forEach((o2) => {
            if (objectsEqual(o1, o2)) {
                found = true;
            }
        });
        if (!found) {
            arr.push(o1);
        }
    })
    return arr;
}


function mapStateToProps(state) {
    return { user: state.userProfile }
}
export default connect(mapStateToProps, {})(Song_View);
