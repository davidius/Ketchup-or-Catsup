import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import {findCategoryByName, findListByName} from '../js/functions.js';

// @TODO: the below props need updating
/* props = modalIsOpen, onAfterOpen, onRequestClose, style, contentLabel, categories, addItem, lists, listToShow */
export default class AddItemModal extends Component {
  constructor(props){
    super(props);

    this.state = {
      itemName: "",
      categoryName: "",
      listName: "",
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleListChange = this.handleListChange.bind(this);
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

  handleListChange(event, index, value) {
    this.setState({
      listName: value
    });
  }

  handleAddItem(event) {
    event.preventDefault();
    let itemName = this.state.itemName.trim();

    if(itemName !== "" && this.props.categories.length > 0){
      const category = findCategoryByName(this.state.categoryName, this.props.categories);
      const list = this.state.listName !== "Default list" && this.state.listName !== "" ? findListByName(this.state.listName, this.props.lists) : undefined;
      this.props.addItem(itemName, category, list);
      this.handleClose();
    }
  }

  handleClose = () => {
    this.setState({
      itemName: "",
      categoryName: "",
      listName: "",
    });
    this.props.onRequestClose();
  };

  componentWillReceiveProps(){
    if(this.props.categories && this.props.categories.length>0){
      this.setState({
        categoryName: this.props.categories[0].name
      });
    }
    if(this.props.listToShow) {
      this.setState({
        listName: this.props.listToShow.name
      });
    } else {
      this.setState({
        listName: "Default list"
      });
    }
  }

  render() {
    let categoriesToShow = [];
    let listsToShow = [];
    const { categories, lists } = this.props;

    if(categories && this.state.categoryName){
      categories.forEach((category) => {
        categoriesToShow.push(<MenuItem value={category.name} primaryText={category.name} key={category.id}></MenuItem>)
      });
    }

    if (lists) {
      listsToShow.push(<MenuItem value="Default list" primaryText="Default list" key="unlisted-key"></MenuItem>);
      lists.forEach((list) => {
        listsToShow.push(<MenuItem value={list.name} primaryText={list.name} key={list.id}></MenuItem>)
      });
    }

    let noCategoriesMessage;
    if(categories && categories.length === 0){
      noCategoriesMessage = <div className="error-message">{`You'll need to add at least one category before you can add an item.`}</div>;
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
        <div>
          { lists && lists.length > 0 ?
            <SelectField floatingLabelText="List" value={this.state.listName} onChange={this.handleListChange}>
              {listsToShow}
            </SelectField> : null
          }
        </div>
      </Dialog>
    );
  }
}
