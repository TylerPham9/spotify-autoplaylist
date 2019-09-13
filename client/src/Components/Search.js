import React from 'react'
import { connect } from 'react-redux';
import {
    Container,
    Button,
    Form,
    Input,
    Card,
    Image,
    Grid,
    Divider,
    Icon
} from 'semantic-ui-react';
import SpotifyWebApi from 'spotify-web-api-js';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import _ from 'lodash';

const spotifyApi = new SpotifyWebApi();

class Search extends React.Component {
    constructor(props) {
        super(props);
        spotifyApi.setAccessToken(props.user.accessToken);
        this.state = {
            searchResults: "",
            search: "",
            tagOptions: {},
        }
        this.doSearch = this.doSearch.bind(this)
    }

    componentWillMount() {
        // Get the users tags 
        // fetch("http://localhost:9000/api/tags/user/" + this.props.user.id, {
        fetch("http://localhost:9000/api/tags/", {
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
                    // Create tag options for tag dropdown menu
                    const tagOptions = _.map(json, (tag) => ({
                        key: tag.id,
                        text: tag.name,
                        value: tag.id
                    }))
                    this.setState({
                        tagOptions: tagOptions
                    })
                });
            }
        });
    }

    // Form for searching songs
    SearchForm = () => (
        <Form onSubmit={this.doSearch} style={{ width: '30vw' }}>
            <Form.Field
                icon="search"
                // label="Song Name"
                placeholder="Song Name..."
                value={this.state.search}
                onChange={this.handleSearchInputChange}
                control={Input}
            />
            <Button type="submit">Search</Button>
        </Form>
    )

    // Handles the change in search input
    handleSearchInputChange = (e) => {
        this.setState({
            search: e.target.value
        });
    }

    // Search spotify for songs
    // Only return the first page
    // For each search result, store select data
    doSearch() {
        spotifyApi.searchTracks(this.state.search)
            .then(data => {
                // Print some information about the results
                console.log('I got ' + data.tracks.total + ' results!');

                // Go through the first page of results
                var firstPage = data.tracks.items;
                console.log(
                    'The tracks in the first page are.. (popularity in parentheses)'
                );
                var searchResults = []
                firstPage.forEach(function (track, index) {
                    searchResults.push({
                        index: index,
                        name: track.name,
                        popularity: track.popularity,
                        id: track.id,
                        albumTitle: track.album.name,
                        albumArt: track.album.images[0].url,
                        artistName: track.artists[0].name
                    })
                });
                this.setState({ searchResults: searchResults })
                // console.log(searchResults)
            })
            .catch(function (err) {
                console.log('Something went wrong:', err.message);
            });
    }

    onPlayClick(id) {
        spotifyApi.play({
            uris: ["spotify:track:" + id]
        })
    }
    onPauseClick() {
        spotifyApi.pause()
    }

    render() {
        let searchResults;
        if (this.state.searchResults) {
            searchResults = this.state.searchResults.map((track) => {
                var href = '/song/' + track.id;
                return (
                    <Card key={track.index}>
                        <Card.Content>
                            <a href={href}>
                                <Image floated='left' size='tiny' src={track.albumArt} />
                                <Card.Header>{track.name}</Card.Header>
                                <Card.Meta>{track.artistName}</Card.Meta>
                                <Card.Meta>{track.albumTitle}</Card.Meta>
                            </a>
                            <Card.Description>
                                <Button icon onClick={() => this.onPlayClick(track.id)}>
                                    <Icon name='play' />
                                </Button>
                                <Button icon onClick={() => this.onPauseClick()}>
                                    <Icon name='pause' />
                                </Button>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                )
                
            });
        }

        return (
            <Container style={{width:'95%'}}>
                <Grid.Column>
                    <h1>Search</h1>
                    <this.SearchForm />
                    <Divider hidden />
                    <Card.Group stackable>
                        {searchResults}
                    </Card.Group>
                </Grid.Column>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.userProfile }
}
export default connect(mapStateToProps, {})(Search);
