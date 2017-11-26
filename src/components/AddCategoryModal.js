import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

/* props = modalIsOpen, onAfterOpen, onRequestClose, style, contentLabel, addCategory */
export default class AddCategoryModal extends Component {
  constructor(){
    super();

    this.state = {
      categoryName: ""
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.addCategoryActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Add category!"
        primary={true}
        onClick={this.handleAddCategory}
      />,
    ];
    this.handleClose = this.handleClose.bind(this);
  }

  handleTextChange(event, value) {
    this.setState({
      categoryName: value
    });
  }

  handleAddCategory(event) {
    event.preventDefault();
    let categoryName = this.state.categoryName.trim();

    if(categoryName !== ""){
      this.props.addCategory(categoryName);
      this.props.onRequestClose();
    }
  }

  handleClose = () => {
    this.setState({
      categoryName: "",
    });
    this.props.onRequestClose();
  };

  render() {
    return(
      <Dialog
        title="Add category"
        actions={this.addCategoryActions}
        modal={false}
        open={this.props.modalIsOpen}
        onRequestClose={this.props.onRequestClose}
      >
        <div>
          <TextField hintText="Your category's name" onChange={this.handleTextChange}/>
        </div>
      </Dialog>
    );
  }
}