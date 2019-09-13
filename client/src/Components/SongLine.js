import React from 'react'
import {Icon, Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import TagList from './TagList';
import SpotifyWebApi from 'spotify-web-api-js';
import _ from 'lodash';

const spotifyApi = new SpotifyWebApi();

class SongLine extends React.Component {
    constructor(props) {
        super(props);
        spotifyApi.setAccessToken(props.user.accessToken);
        this.onPlayClick=this.onPlayClick.bind(this);
    }

    onPlayClick() {
        var song_id = this.props.song.spotifyId;
        spotifyApi.play({
            uris: ["spotify:track:" + song_id]
        })
    }
    render() {
        const href= 'song/' + this.props.song.spotifyId;
        const tags =  _.map(this.props.song.Tags, (tag) => ({
            key: tag.name,
            text: tag.name,
            value: tag.name
        }))
        
        return (
            <Table.Row>
                <Table.Cell collapsing>
                    <Icon name='play' style={{float:'left'}} onClick={this.onPlayClick}/>
                </Table.Cell>
                <Table.Cell>
                    <a href={href}><h3>{this.props.song.name}</h3></a>
                </Table.Cell>
                <Table.Cell>
                    {this.props.song.artist}
                </Table.Cell>
                <Table.Cell>
                    {this.props.song.album}
                </Table.Cell>
                <Table.Cell>
                    <TagList currentTags={tags}/>
                </Table.Cell>               

            </Table.Row>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.userProfile }
}


export default connect(mapStateToProps, {})(SongLine);