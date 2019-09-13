import React from 'react';
import { Label, Icon } from 'semantic-ui-react';

export default class TagList extends React.Component {

    render() {
        let tagList;
        tagList = this.props.currentTags.map ((tag) => {
            if ('deleteTag' in this.props) {
            return (
                <Label key={tag.key}>
                    {tag.text}
                    <Icon class='mini' onClick={() => this.props.deleteTag(tag.key)} name='delete'/>
                </Label>
            )}
            return (
                <Label key={tag.key}>
                    {tag.text}
                </Label>
            )

        })
        return (
            <span>
                {tagList}
            </span>
                      
        )
    }

}