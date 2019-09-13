import cytoscape from 'cytoscape';
import React from 'react';
import {connect} from 'react-redux';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

const containerStyle={
    width: '50%', 
    height: '600px', 
    backgroundColor:'white',
    float:'left' 
};
const stylesheet=[
    {
      selector: 'node',
      style: {
        textValign : "center",
        textHalign : "center",
        content: 'data(label)',
        fontWeight :'bold',
        width: 150,
        height: 50,
        backgroundColor:'#1DB954',
        shape: 'rectangle',
      }
    },
    {
      selector: 'edge',
      style: {
        width: 1,
        lineColor:'#1DB954',
        targetArrowColor:'#1DB954',
        label: 'data(label)',
        targetArrowShape: 'triangle'
      }
    }
];
const layout = {
    name:'random'
}

function playPlaylist (nodeId) {
    spotifyApi.play({
        context_uri: "spotify:playlist:" + nodeId
    });
}

class Graph extends React.Component {
    constructor(props) {
        super(props);
        spotifyApi.setAccessToken(props.user.accessToken);
        
    }

    componentDidMount() {
        this.cy = new cytoscape({
            container: document.getElementById('cy'),
            elements: this.props.elements,
            style: stylesheet,
            layout: layout
        })
        this.cy.on('tap','node', function(evt){
            var node = evt.target;
            playPlaylist(node.id());
        })
    }

    componentDidUpdate(prevProps) {
        if(this.props.elements !== prevProps.elements) {
            this.cy = new cytoscape({
                container: document.getElementById('cy'),
                elements: this.props.elements,
                style: stylesheet,
                layout: layout
            })
            this.cy.on('tap','node', function(evt){
                var node = evt.target;
                playPlaylist(node.id());
            })
        }
    }
    render() {
        return (
            <div style={containerStyle} id="cy"/>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.userProfile }
}

export default connect(mapStateToProps)(Graph);
