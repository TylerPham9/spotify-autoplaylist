import React from 'react';
import {connect} from 'react-redux';
import { Container, List, Form, Select, Input, Button, Popup, Image } from 'semantic-ui-react';
import SpotifyWebApi from 'spotify-web-api-js';
import _ from 'lodash';
import Graph from './Graph';
import GraphTutorial from './GraphTutorial.PNG';

const spotifyApi = new SpotifyWebApi();

class Home extends React.Component {
    constructor(props) {
        super(props);
        spotifyApi.setAccessToken(props.user.accessToken);

        this.state = {
            playlists:[],
            nodes:[],
            isPlaylistLoaded: false,
            edges:[]
        }
        this.getPlaylistList = this.getPlaylistList.bind(this);
        this.addNodes = this.addNodes.bind(this);
        this.addEdge = this.addEdge.bind(this);
        this.findIndex = this.findIndex.bind(this);
    }

    componentWillMount() {
        this.getPlaylistList();
    }

    findAndUpdateStatus(list, playlist) {
        list.forEach(element => {
            if (element.key === playlist.key){
                if(element.isselected === 'true'){
                    element.isselected= 'false';
                }
                else {
                    element.isselected= 'true'
                }
            }
        });
        return list;
    }

    findIndex(value) {
        const {playlists} = this.state;

        for (let pl of playlists) {
            if (pl.text === value) {
                return pl.key
            }
        }

    }
    addNodes(playlist) {
        const newNode = {
            data: {
                id: playlist.key,
                label: playlist.text
            }
        }
        const newList = this.findAndUpdateStatus(this.state.playlists, playlist);
        this.setState({
            nodes: [newNode, ...this.state.nodes],
            playlists: newList
        })
    }

    addEdge(sourceNode,targetNode, note) {
        const sourceNodeId = this.findIndex(sourceNode);
        const targetNodeId = this.findIndex(targetNode);
        const newEdge = {
            data: {source: sourceNodeId, 
                target: targetNodeId, 
                label:note}
        }
        this.setState({
            edges: [newEdge, ...this.state.edges]
        })
    }


    getPlaylistList() {
        spotifyApi.getUserPlaylists()
            .then((response) => {
                if(response) {
                    var playlists;
                    if (response.items.length === 0) {
                        playlists = [
                            {key: 'noid',
                            text: 'No Playlist',
                            value:'No Playlist',
                            isselected: null
                        }]
                    }
                    else {
                        playlists = _.map(response.items, (playlist) => ({
                            key: playlist.id,
                            text: playlist.name,
                            value: playlist.name,
                            isselected: "false"                
                        }));
                    }
                        
                        this.setState({
                            playlists: playlists,
                            isPlaylistLoaded: true                    
                            });
                    
                }                
                
            })
    }

    render() {

        if (this.state.isPlaylistLoaded) {         
            var elements = this.state.nodes.concat(this.state.edges);
            const playlistsList = this.state.playlists.map((playlist) => 
                <PlaylistItem 
                    playlist={playlist}
                    deleteNodes={this.deleteNodes} 
                    addNodes={this.addNodes}/>
            );          
            return (
                <Container style={{width:'95%', display:'block'}}>
                <h1>Homepage</h1>
                <Graph elements={elements} playPlaylist={this.onPlayClick}/>
                <div style={{float:'left', width:'40%', marginLeft:'50px'}}>
                    <Popup trigger={<Button style={{backgroundColor:'#1DB954'}}>Show Tutorial</Button>} flowing hoverable>
                            <h3 style={{color:'black'}}>Tutorial</h3>
                            <div style={{marginRight:'15px'}}>
                                1. Draw out the flow of your listening session by adding nodes and edges. <br/>
                                   Move the nodes to around to fit your layout.<br/>
                                2. Click on a node to quickly play a playlist.<br/><br/>
                            </div>
                            <Image src={GraphTutorial} size='large'/>
                    </Popup>
                    <div style ={{width:'60%'}}>
                        <h3 style={{marginBottom:'0px'}}><br/>Add Nodes</h3>  
                        <List divided relaxed size='large' style={listStyle}>
                            {playlistsList}
                        </List>
                        <h3 style={{marginBottom:'0px'}}>Add Edges</h3>
                        <EdgeForm playlists={this.state.playlists} addEdge={this.addEdge}/>
                    </div>
                    
                    
                </div>
                
                </Container>
            )
        }
        else {
            return null;
        }
        
    }
}

const listStyle = {
    backgroundColor:'white',
    width:'80%', 
    height:'150px',
    marginTop:'0px',
    marginRight:'20px',
    paddingTop:'5px',
    paddingLeft:'5px',
    overflowY: "auto",
    paddingBottom: '5px'

}

class PlaylistItem extends React.Component {
    render() {
        const isselected =  this.props.playlist.isselected;
        if(this.props.playlist.key === 'noid') {
            return(
                <List.Item>
                    <List.Content>No Playlists</List.Content>
                </List.Item>
            )
        }
        else {
            return(
                <List.Item>
                    {isselected==="true" ? (
                        <List.Icon name='check'/> ) : (
                        <List.Icon name='plus' onClick={() => this.props.addNodes(this.props.playlist)}/>)}
                    <List.Content>
                        <List.Header>{this.props.playlist.text}</List.Header>
                    </List.Content>
                    
                </List.Item>
            )
        }
        
    }
}

class EdgeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sourceNode: '',
            targetNode: '',
            note: '',
        }
        this.handleSubmit=this.handleSubmit.bind(this);
    }


    handleSubmit(event) {
        this.props.addEdge(this.state.sourceNode,
                    this.state.targetNode,
                    this.state.note);
        event.preventDefault();
    }
    render() {
        const selectedOption= this.props.playlists.filter(function(item){
            return item.isselected === 'true';
        });
        return(
            <Form style={{width:'80%'}} onSubmit={this.handleSubmit}>
                <Form.Field control={Select} 
                    options={selectedOption}
                    onChange={(e, {value}) => this.setState({sourceNode:value})} 
                    placeholder='Source Node'/>
                <Form.Field control={Select} 
                    options={selectedOption}
                    onChange={(e, {value}) => this.setState({targetNode:value})} 
                    placeholder='Target Node'/>
                <Form.Field control={Input}
                    onChange={(e, {value}) => this.setState({note:value})}  
                    placeholder='Notes on the Edge'/>
                <Form.Field control={Button} style={{backgroundColor:'#1DB954'}}>Submit</Form.Field>
            </Form>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.userProfile }
}



export default connect(mapStateToProps)(Home);
