import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import Checkbox from 'material-ui/Checkbox';

/* displays an individual item */
/*props = item, deleteItem
  state = checked */
export default class ItemButton extends Component {
  // contains a checkbox, some text, and an edit button (which brings up a modal)
  constructor() {
    super();

    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleCheckboxClick(event) {
    const { item } = this.props;
    let correspondingItem = item;
    this.props.deleteItem(correspondingItem);
  }

  handleEditClick() {
    const { item, openEditItemModal } = this.props;
    openEditItemModal(item.id);
  }

  render(){
    const { item } = this.props;
    let liID = "btn-item-" + item.id;
    let checkID = "check-" + item.id;
    let editID = "btn-modal-edit-" + item.id;
    return(
      <li key={item.id} className="item-button-steez" id={liID}>
        <div className="checkbox-wrapper">
          <Checkbox
            onCheck={this.handleCheckboxClick}
            id={checkID}
            className="item-button-check"
          />
        </div>
        <div className="item-name">
          {item.name}
        </div>
        <div className="edit-button-wrapper">
          <a className="item-button-edit" onClick={this.handleEditClick}>
            <ModeEditIcon />
          </a>
        </div>
      </li>
    );
  }
}
