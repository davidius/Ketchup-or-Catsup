import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

/* props = modalIsOpen, onAfterOpen, onRequestClose, style, contentLabel, addList */
export default class AddListModal extends Component {
  constructor(){
    super();

    this.state = {
      listName: ""
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleAddList = this.handleAddList.bind(this);
    this.addListActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Add list!"
        primary={true}
        onClick={this.handleAddList}
      />,
    ];
    this.handleClose = this.handleClose.bind(this);
  }

  handleTextChange(event, value) {
    this.setState({
      listName: value
    });
  }

  handleAddList(event) {
    event.preventDefault();
    let listName = this.state.listName.trim();

    if(listName !== ""){
      this.props.addList(listName);
      this.props.onRequestClose();
    }
  }

  handleClose = () => {
    this.setState({
      listName: "",
    });
    this.props.onRequestClose();
  };

  render() {
    return(
      <Dialog
        title="Add list"
        actions={this.addListActions}
        modal={false}
        open={this.props.modalIsOpen}
        onRequestClose={this.props.onRequestClose}
      >
        <div>
          <TextField hintText="Your list's name" onChange={this.handleTextChange}/>
        </div>
      </Dialog>
    );
  }
}
