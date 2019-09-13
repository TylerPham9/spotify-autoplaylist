import React, { Component } from 'react'
import { Dropdown, Container } from 'semantic-ui-react'
import { connect } from 'react-redux';

function findIndex(array, value) {
    for (var i=0;i < array.length; i++) {
        if (array[i].value === value) {
            return array[i].key;
        }
    }

}

class TagForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTags: this.props.tags,
            tagOptions: this.props.tagOptions,
            track: this.props.track
        }
    }

    handleChange = (e, {value}) => {
        var tagId = findIndex(this.props.tagOptions,value);
        console.log('onchange tag value' + tagId);
        if (tagId){
            this.props.postSong(tagId);
        }
        
    }

    handleAddition = (e, {value}) => {
        this.props.postTag(value);            
    }

    render() {
        return (
            <Container>
                <Dropdown
                    options={this.props.tagOptions}
                    placeholder="Type in a new Tag"
                    search
                    selection
                    allowAdditions
                    onAddItem={this.handleAddition}
                    onChange={this.handleChange}
                    style={{width:'20%'}}
                />
            </Container>
           
        );
    }
}

function mapStateToProps(state) {
    return { user: state.userProfile }
}
export default connect(mapStateToProps, {})(TagForm);
