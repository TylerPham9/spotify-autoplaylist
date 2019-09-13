import React from 'react'; 
import {Button} from 'semantic-ui-react';

import loginImage from './loginImage.jpg';

const buttonStyle = {
    backgroundColor: '#1DB954',
    color: '#000000',
}
const containerStyle = {
    backgroundImage: `url(${loginImage})`,
    backgroundPosition: 'center',
    padding: '0em',
    margin: '0em !important',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100%',
    display: 'flex',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center'
}


export default class Login extends React.Component {

    render() {
        return (
            <div style={containerStyle}>
                <h1 style={{color:'white', fontSize: '500%'}}>Spotify AutoPlaylist</h1>
                <p style={{color:'#1DB954', fontSize:'250%', fontStyle:'italic'}}>Change the way you think of Spotify</p>              
                    <a href='http://localhost:9000/login'>
                        <Button className="ui button" style={buttonStyle} size="large">
                        Login To Spotify
                        </Button>
                    </a>
        
            </div>
        )
    }
   
}

