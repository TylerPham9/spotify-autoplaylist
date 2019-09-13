import React from 'react';
import { connect } from 'react-redux';
import { Button, Container, Icon, Image, Card } from 'semantic-ui-react';

// Followed https://mbell.me/blog/2017-12-29-react-spotify-playback-api/

const playerTitleStyle = {
    color: '#FFFFFF',
    opacity: 0.9
}
const playerDetailStyle = {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: '75%',
}

class Player extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            deviceId: "",
            error: "",
            trackName: "",
            artistName: "",
            albumName: "",
            albumArtUrl: "",
            playing: false,
            position: 0,
            duration: 0,
        };

        this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }

    checkForPlayer() {
        // Connect to the spotify player when the SDK loads
        if (window.Spotify !== null) {
            clearInterval(this.playerCheckInterval);
            this.player = new window.Spotify.Player({
                name: "Spotify Autoplaylist",
                getOAuthToken: cb => { cb(this.props.user.accessToken) }
            });

            this.createEventHandlers();
            this.player.connect();
        }
    }

    createEventHandlers() {
        this.player.on('initialization_error', e => { console.error(e); });
        this.player.on('authentication_error', e => {
            console.error(e);
            this.setState({ loggedIn: false });
        });
        this.player.on('account_error', e => { console.error(e); });
        this.player.on('playback_error', e => { console.error(e); });

        // Playback status updates
        this.player.on('player_state_changed', state => this.onStateChanged(state));

        // Ready
        this.player.on('ready', async data => {
            let { device_id } = data;

            console.log("Let the music play on!");
            await this.setState({ deviceId: device_id });
            this.transferPlaybackHere();
        });
    }

    onStateChanged(state) {
        // if we're no longer listening to music, we'll get a null state.
        if (state !== null) {
            const {
                current_track: currentTrack,
                position,
                duration,
            } = state.track_window;
            const trackName = currentTrack.name;
            const albumName = currentTrack.album.name;
            const artistName = currentTrack.artists
                .map(artist => artist.name)
                .join(", ");
            const albumArtUrl = currentTrack.album.images[0].url
            const playing = !state.paused;
            this.setState({
                position,
                duration,
                trackName,
                albumName,
                artistName,
                playing,
                albumArtUrl
            });
        }
    }

    transferPlaybackHere() {
        // When device id is set, use this to connect back to the webplayer
        const { deviceId } = this.state;
        const token = this.props.user.accessToken;
        fetch("https://api.spotify.com/v1/me/player", {
            method: "PUT",
            headers: {
                authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "device_ids": [deviceId],
                "play": true,
            }),
        });
    }

    togglePlayClick() {
        console.log("PLAY")
        this.player.togglePlay()
    }

    onPrevClick() {
        console.log("Skip to previous")
        this.player.previousTrack();
    }

    onNextClick() {
        console.log("Skip to next")
        this.player.nextTrack();
    }

    render() {
        return (
            <Container>
                <Card style={{
                    backgroundColor: "#212121",
                    boxShadow: 'none'
                }}>
                    <Card.Content textAlign='center'>
                        <Image
                            src={this.state.albumArtUrl}
                            style={{marginBottom:'20px'}}
                            size='small'
                            rounded />
                        <Card.Header style={playerTitleStyle}>{this.state.trackName}</Card.Header>
                        <Card.Meta style={playerDetailStyle}>{this.state.artistName}</Card.Meta>
                        <Card.Meta style={playerDetailStyle}>{this.state.albumName}</Card.Meta>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui three buttons'>
                            <Button icon onClick={() => this.onPrevClick()}>
                                <Icon name='step backward'></Icon>
                            </Button>
                            <Button icon onClick={() => this.togglePlayClick()}>
                                <Icon name={this.state.playing ? "pause" : "play"}></Icon>
                            </Button>
                            <Button icon onClick={() => this.onNextClick()}>
                                <Icon name='step forward'></Icon>
                            </Button>
                        </div>
                    </Card.Content>
                </Card>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.userProfile }
}

export default connect(mapStateToProps, {})(Player);
