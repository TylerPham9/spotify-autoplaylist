import React from 'react';
import { BrowserRouter as Router,Route} from "react-router-dom";
import { loggedOut, removeUser } from '../Redux/actions';
import { Sidebar, SidebarItem } from 'react-responsive-sidebar';
import { connect } from 'react-redux';
import Player from './Player';
import Home from './Home';
import Search from './Search';
import Playlists from './ListOfPlaylists';
import Songs from './Songs';
import Song_View from './Song_View';
import PlaylistDisplay from './PlaylistDisplay';
import Tagged_View from './Tagged_View';
import SpotifyWebApi from 'spotify-web-api-js';
import { Button } from 'semantic-ui-react';

const spotifyApi = new SpotifyWebApi();

class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }
    
    logout() {
        console.log('Loging out');
        fetch("http://localhost:9000/logout");
        // spotifyApi.pause();
        this.props.loggedOut();
        this.props.removeUser();
    }

    render() {
        const sidebarItems = [
            <SidebarItem>
                <h1 style={{
                    color: '#1DB954',
                    fontSize: '2em',
                    letterSpacing: '0.03em'
                }}>Autoplaylists</h1></SidebarItem>,
            <SidebarItem href='/'>Home</SidebarItem>,
            <SidebarItem href='/search'>Search</SidebarItem>,
            <SidebarItem href='/playlists'>Playlists</SidebarItem>,
            <SidebarItem href='/songs'>Tagged Songs</SidebarItem>,
            <SidebarItem href='/tagged'>Tag Query</SidebarItem>,
            <SidebarItem><h3 onClick={this.logout}>Logout</h3></SidebarItem>,
            <Player />
        ]; 
        
        return (
            <Router>
                <Sidebar background='#212121' content={sidebarItems} toggleIconColor='#212121'>
                    <div style={{marginTop:'50px',width:'95%'}}>
                        <Route path='/' exact component={Home}/>
                        <Route path='/search' exact component={Search}/>
                        <Route path='/songs' exact component={Songs}/>
                        <Route path='/playlists' exact component={Playlists}/>
                        <Route path='/song/:song_id' component={Song_View}/>
                        <Route path='/tagged' component={Tagged_View}/>
                        <Route path='/playlist/:playlist_id/:playlist_name' component={PlaylistDisplay}/>
                    </div>
                </Sidebar>
            </Router>
        );
    }

}

export default connect(null, { loggedOut, removeUser })(Homepage);

