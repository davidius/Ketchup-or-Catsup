import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import {findCategoryByName} from '../js/functions.js';

// @TODO: the below props need updating
/* props = modalIsOpen, onAfterOpen, onRequestClose, style, contentLabel, categories, addItem */
export default class AddItemModal extends Component {
  constructor(props){
    super(props);

    this.state = {
      itemName: "",
      categoryName: ""
    };
    
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.addItemActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Add item!"
        primary={true}
        keyboardFocused={false}
        onClick={this.handleAddItem}
      />,
    ];
    this.handleClose = this.handleClose.bind(this);
  }

  handleTextChange(event, value) {
    this.setState({
      itemName: value
    });
  }

  handleDropdownChange(event, index, value) {
    this.setState({
      categoryName: value
    });
  }

  handleAddItem(event) {
    event.preventDefault();
    let itemName = this.state.itemName.trim();

    if(itemName !== "" && this.props.categories.length > 0){
      let actualCategory = findCategoryByName(this.state.categoryName, this.props.categories);
      this.props.addItem(itemName, actualCategory);
      this.handleClose();
    }
  }

  handleClose = () => {
    this.setState({
      itemName: "",
      categoryName: "",
    });
    this.props.onRequestClose();
  };

  componentWillReceiveProps(){
    if(this.props.categories && this.props.categories.length>0){
      this.setState({
        categoryName: this.props.categories[0].name
      });
    }
  }

  render() {
    var categoriesToShow = [];
    const { categories } = this.props;
    
    if(categories && this.state.categoryName){
      categories.forEach((category) => {
        categoriesToShow.push(<MenuItem value={category.name} primaryText={category.name} key={category.id}></MenuItem>)
      });
    }

    var noCategoriesMessage;
    if(categories && categories.length === 0){
      noCategoriesMessage = <div className="error-message">You'll need to add at least one category before you can add an item.</div>;
    }

    return(
      <Dialog
        title="Add item"
        actions={this.addItemActions}
        modal={false}
        open={this.props.modalIsOpen}
        onRequestClose={this.props.onRequestClose}
      >
        <div>
          <TextField hintText="Your item's name" onChange={this.handleTextChange}/>
        </div>
        <div>
          { categories && categories[0].name ? 
            <SelectField floatingLabelText="Your item's category" value={this.state.categoryName} onChange={this.handleDropdownChange}>
              {categoriesToShow}
            </SelectField>
            : {noCategoriesMessage}
          }
        </div>
        
      </Dialog>
    );
  }
}