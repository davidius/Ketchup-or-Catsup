import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import {findCategoryById, findCategoryByName, findListByName, findListById, exists} from '../js/functions.js';

// @TODO: the below props need updating
/* props = modalIsOpen, onAfterOpen, onRequestClose, style, contentLabel, categories, addItem, itemToEdit */
export default class EditItemModal extends Component {
  constructor(props){
    super(props);
    const listName = this.props.itemToEdit.listId ? findListById(this.props.itemToEdit.listId, this.props.lists).name : "[No list]";

    this.state = {
      newItemName: this.props.itemToEdit.name,
      categoryName: findCategoryByName(this.props.itemToEdit.tagId, this.props.categories),
      listName: listName
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleListChange = this.handleListChange.bind(this);
    this.handleEditItem = this.handleEditItem.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.editItemActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Save changes!"
        primary={true}
        keyboardFocused={false}
        onClick={this.handleEditItem}
      />,
    ];
  }

  handleTextChange(event, value) {
    this.setState({
      newItemName: value
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
    }, () => {
      console.dir(findListByName(this.state.listName, this.props.lists));
    });
  }

  handleEditItem(event) {
    event.preventDefault();
    const { itemToEdit, categories } = this.props;
    const { categoryName } = this.state;
    let newItemName = this.state.newItemName.trim();

    if(newItemName !== "" && categories.length > 0){
      let actualCategory = findCategoryByName(categoryName, categories);
      const list = this.state.listName !== "[No list]" && this.state.listName !== "" ? findListByName(this.state.listName, this.props.lists) : undefined;
      this.props.editItem(itemToEdit, newItemName, actualCategory, list);
      this.handleClose();
    }
  }

  handleClose () {
    this.props.onRequestClose();
  }

  componentWillReceiveProps(){
    const { itemToEdit, categories, lists } = this.props;
    if(categories && categories.length > 0 && findCategoryById(itemToEdit.tagId, categories)){
      this.setState({
        newItemName: itemToEdit.name,
        categoryName: findCategoryById(itemToEdit.tagId, categories).name
      });
    }
    if (lists && lists.length > 0) {
      const listName = exists(itemToEdit.listId) ? findListById(itemToEdit.listId, lists).name : "[No list]";
      this.setState({
        listName
      });
    }
  }

  render() {
    var categoriesToShow = [];
    let listsToShow = [];
    const { categories, lists, itemToEdit } = this.props;

    if(categories && this.state.categoryName){
      categories.forEach((category) => {
        categoriesToShow.push(<MenuItem value={category.name} primaryText={category.name} key={category.id}></MenuItem>)
      });
    }

    if (lists) {
      listsToShow.push(<MenuItem value="[No list]" primaryText="[No list]" key="unlisted-key"></MenuItem>);
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
        title="Edit item"
        actions={this.editItemActions}
        modal={false}
        open={this.props.modalIsOpen}
        onRequestClose={this.props.onRequestClose}
      >
        <div>
          <TextField hintText="Your item's name" onChange={this.handleTextChange} defaultValue={this.state.newItemName}/>
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
