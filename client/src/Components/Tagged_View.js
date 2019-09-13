import React from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
import { connect } from 'react-redux';
import { 
    Container,
    Card,
    Grid,
    Button,
    Icon,
    Input,
    Label
} from 'semantic-ui-react';
import ReactTags from 'react-tag-autocomplete'
import queryString from 'query-string';
import './Tagged_View.css'

const spotifyApi = new SpotifyWebApi();

class Tagged_View extends React.Component {
    constructor(props){
        super(props);
        console.log("Tagged View");
        console.log(props);
        console.log("Search: " + this.props.location.search)
        var params;
        if(this.props.location.search.length > 0) {
            params = queryString.parse(this.props.location.search, {arrayFormat: 'comma'})
            this.params = params
        } else {
            params = {
                tags: []
            }
            this.params = params
        }
        this.state = {
            selectedTags: this.params.tags,
            listOfSongs: [],
            tags: [],
            suggestions: [],
            isSaveEnabled: false,
            isNoMatchingSongs: false
        }
        spotifyApi.setAccessToken(props.user.accessToken);
        this.getUserSongsByTags = this.getUserSongsByTags.bind(this);
    }

    async getSuggestions() {
        const response = await fetch("http://localhost:9000/api/tags", {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        });
        if(response.ok) {
            console.log("Making suggestions")
            response.json().then(json => {
                const tags = json.map(tag => {
                    return {
                        id: tag.id,
                        name: tag.name
                    }
                })
                console.log(tags)
                this.setState({
                    suggestions: tags
                })
            })
        }
    }

    async getSongDetailsSpotify(json) {
        var songIds = []
        // Get all song ids to update
        console.log("starting");
        for(var track in json) {
            console.log(json[track])
            songIds.push(json[track].spotifyId);
        }
        console.log(songIds)
        const songDetails = await spotifyApi.getTracks(songIds).catch(function(err) {
            console.log("Something went wrong getting song details")
            console.log(err)
        });
        console.log(songDetails)
        console.log("fetch details")
        var listOfSongs = []
        for(var track in songDetails.tracks) {
            listOfSongs.push({
                name: songDetails.tracks[track].name,
                popularity: songDetails.tracks[track].popularity,
                id: songDetails.tracks[track].id,
                albumTitle: songDetails.tracks[track].album.name,
                albumArt: songDetails.tracks[track].album.images[0].url,
                artistName: songDetails.tracks[track].artists[0].name
            })
        }
        this.setState({
            listOfSongs: listOfSongs
        })
    }

    async initalParseTags(tags) {
        var newTags = []
        for(var i in tags) {
            newTags.push({
                id: i,
                name: tags[i]
            })
        }
        this.setState({
            tags: newTags
        })
        console.log("initial parse of tags")
        console.log(newTags)
        await this.getUserSongsByTags(newTags)
    }

    async getUserSongsByTags(tags) {
        // Parsing user input
        if(tags.length == 0) {
            this.setState({
                listOfSongs: []
            })
            return;
        }
        console.log("Tags are ")
        console.log(tags)
        tags = tags.map(tag => {
            return tag.name
        })
        tags = "\"" + tags.join("\",\"") + "\"";
        var request = "http://localhost:9000/api/songs/user/" + this.props.user.id + "/?tags=[" + tags + "]";
        console.log(request)
        const response = await fetch( request, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
        });
        console.log("Fetching tagged songs")
        if (response.ok) {
            response.json().then(json => {
                console.log("Json is:")
                console.log(json)
                if(json.message) {
                    if(json.message.includes("User does not have any")) {
                        this.setState({
                            isNoMatchingSongs: true
                        })
                    }
                } else {
                    this.setState({
                        isNoMatchingSongs: false
                    });
                    this.getSongDetailsSpotify(json);
                }
                
                console.log("here");
            });
        } else {
            console.log("Response is not okay")
            console.log(response)
        }
    }

    async savePlaylist() {
        // Gather songs in uri format
        let userid = this.props.user._json.id
        console.log(userid)
        let songURIs = this.state.listOfSongs.map(function(track) {
            return "spotify:track:" + track.id
        })
        var options = {
            name: this.state.saveName,
            public: false,
            collaborative: false,
            description: "Generated by AutoPlaylist"
        }
        // console.log("playlist")
        // console.log(songURIs)
        // console.log(options)
        spotifyApi.createPlaylist(userid, options).then( function(data) {
            // Extract playlist id
            let playlistId = data.id
            console.log("playlistid")
            console.log(playlistId)
            // Push to playlist
            spotifyApi.addTracksToPlaylist(playlistId, songURIs, {}).catch(function (err) {
                console.log('Something went wrong:', err);
            });
        }).catch(function (err) {
            console.log('Something went wrong:', err);
        });
    }
    
    handleDelete(i) {
        const tags = this.state.tags.slice(0)
        tags.splice(i, 1)
        this.setState({ tags })
        console.log(tags)
        console.log(this.state.tags)
        this.getUserSongsByTags(tags)
    }
    
    handleAdd(tag) {
        const tags = [].concat(this.state.tags, tag)
        this.setState({ tags })
        this.getUserSongsByTags(tags)
    }

    componentWillMount () {
        Promise.all([
            this.initalParseTags(this.state.selectedTags),
            this.getSuggestions()
        ]);
    }

    handleNameChange(event, data) {
        let text = data.value
        var isSaveEnabled = true
        if(text.length == 0) {
            isSaveEnabled = false
        }
        this.setState({
            saveName: text,
            isSaveEnabled, isSaveEnabled
        })
    }

    handlePlaylistSave() {
        this.savePlaylist();
    }

    handleQuerySave() { 

    }

    render() {
        let trackCards;
        if(this.state.isNoMatchingSongs) {
            trackCards = <h2>Sorry, we can't find any songs that match those tags</h2>
        }
        else {
            trackCards = this.state.listOfSongs.map((track) => {
                var href='/song/' + track.id;
                return (
                    <a href={href}>
                        <Card key={track.id}>
                            <Card.Content>
                                <Card.Header>{track.name}</Card.Header>
                                <Card.Meta>{track.artistName}</Card.Meta>
                                <Card.Meta>{track.albumTitle}</Card.Meta>
                            </Card.Content>
                        </Card>
                    </a>
                )
    
            });
        }

        return (
            <Container className="ui" style={{width:'95%'}}>
                <h1>Songs</h1>
                <ReactTags
                    tags={this.state.tags}
                    suggestions={this.state.suggestions}
                    handleDelete={this.handleDelete.bind(this)}
                    handleAddition={this.handleAdd.bind(this)} />
                <Container className="saveBar">
                    <Input 
                        placeholder='Name playlist/query'
                        onChange={this.handleNameChange.bind(this)}/>
                    <Button onClick={this.handlePlaylistSave.bind(this)}
                        disabled={!this.state.isSaveEnabled}>
                        <Icon name="save"/>
                        Save Playlist
                    </Button>
                    {/* Query saving is not supported */}
                    {/* <Button 
                        onClick={this.handleQuerySave.bind(this)}
                        disabled={!this.state.isSaveEnabled}>
                        <Icon name="save"/>
                        Save Query
                    </Button> */}
                </Container>
                <Card.Group style={{marginTop:'30px'}}>
                    <Grid>
                        {trackCards}
                    </Grid>
                </Card.Group>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.userProfile }
}
export default connect(mapStateToProps, {})(Tagged_View);