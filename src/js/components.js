import React, { Component } from 'react';
import {findItemsByCategory, findCategoryByName} from './functions.js';
import Modal from 'react-modal';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import '../styles.css';

/* displays an individual item */
/*props = item, deleteItem
  state = checked */
export class ItemButton extends Component {
  // contains a checkbox, some text, and an edit button (which brings up a modal)
  constructor() {
    super();

    this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
  }

  handleCheckboxClick(event) {
    console.dir(this.props.item);
    let correspondingItem = this.props.item;
    this.props.deleteItem(correspondingItem);
  }

  render(){
    let liID = "btn-item-" + this.props.item.id;
    let checkID = "check-" + this.props.item.id;
    let editID = "btn-modal-edit-" + this.props.item.id;
    return(
      <li key={this.props.item.id} className="item-button-steez" id={liID}>
        <input type="checkbox" className="check-item" id={checkID} onChange={this.handleCheckboxClick} />
        {this.props.item.name}
        <a className="btn btn-default btn-xs btn-modal-edit-item" id={editID}>
          <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
        </a>
      </li>
    );
  }
}

/* a list of ItemButtons headed by the category in which those items appear */
/* props = category, items, deleteItem */
export class ItemList extends Component {
  // needs a function that responds when a list item is clicked...

  render(){
    var itemsToShow = [];
    this.props.items.forEach((item) => {
      itemsToShow.push(<ItemButton key={item.id} item={item} deleteItem={this.props.deleteItem}/>);
    });

    return(
      <div>
        <h2>{this.props.category.name}</h2>
        <ul className="item-list-steez">
          <CSSTransitionGroup
            transitionName="item-list"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            {itemsToShow}
          </CSSTransitionGroup>
        </ul>
      </div>
    );
  }
}

/* displays all the ItemLists */
/* props = items, categories, deleteItem */
export class ListOfLists extends Component {
  render(){
    var listToReturn = [];
    if(this.props.categories){
      this.props.categories.forEach((category) => {
        if(findItemsByCategory(category, this.props.items).length > 0){
          listToReturn.push(<ItemList key={category.id} category={category} items={findItemsByCategory(category, this.props.items)} deleteItem={this.props.deleteItem}/>);
        }
      });
    }

    return(
      <div className="list-of-lists-steez">
        <CSSTransitionGroup
          transitionName="item-list"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {listToReturn}
        </CSSTransitionGroup>
      </div>
    );
  }
}

export class HeadingBar extends Component {
  render(){
    return(
      <div className="heading-bar-steez">
        <span className="ketchup-bottle"></span>
        <span><h1>Ketchup or Catsup</h1></span>
        <MenuButton toggleMenuBar={this.props.toggleMenuBar} menuBarVisible={this.props.menuBarVisible}/>
      </div>
    );
  }
}

export class AddItemButton extends Component {
  render(){
    return(
      <button className="add-item-button-steez" onClick={this.props.openAddItemModal}>+</button>
    );
  }
}

export class AddCategoryButton extends Component {
  render(){
    return(
      <button onClick={this.props.openAddCategoryModal}>Add category</button>
    );
  }
}

export class MenuButton extends Component {
  render(){
    const componentClasses = ["menu-button-steez"];
    if(this.props.menuBarVisible){
      componentClasses.push("move-left");
    }
    return(
      <span className={componentClasses.join(" ")} onClick={this.props.toggleMenuBar}></span>
    );
  }
}

/* props = isVisible, openAddCategoryModal, firebaseSignOut */
export class SideMenu extends Component {
  render(){
    const divStyle = {
      position: "absolute",
      right: -300,
      top: 0,
      width: 300,
      display: "block"
    };

    const componentClasses = ["side-menu-steez"];
    if(this.props.isVisible){
      componentClasses.push("move-left");
    }

    return(
      <div style={divStyle} className={componentClasses.join(" ")}>
        <ul className="navigation">
          <li><a href="#" onClick={this.props.openAddCategoryModal}>Add category</a></li>
          <li><a href="#" onClick={this.props.firebaseSignOut}>Log out</a></li>
        </ul>
      </div>
    );
  }
}

export class SignInView extends Component {
  constructor() {
    super();
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      email: "",
      password: ""
    };
  }

  handleSignIn(event) {
    event.preventDefault();
    this.props.firebaseSignIn(this.state.email, this.state.password);
  }

  handleSignUp(event) {
    event.preventDefault();
    console.log("signing up with email " + this.state.email + " and password " + this.state.password);
    this.props.firebaseSignUp(this.state.email, this.state.password);
  }

  handleInputChange(event) {
    let target = event.target;
    
    if(target.name === "email"){
      this.setState({email: target.value});
    }
    else if(target.name === "password"){
      this.setState({password: target.value});
    }
  }

  render(){
    return(
      <div className="sign-in-view-steez">
        
        <span className="ketchup-bottle"></span>
        <span><h1>Ketchup or Catsup</h1></span>
        <p>Welcome to <strong>Ketchup or Catsup</strong>, a humble little shopping list app.</p>
        <div className="form-group">
          <label>Email: <input type="text" name="email" onChange={this.handleInputChange} /></label>
        </div>
        <div className="form-group">
          <label>Password: <input type="password" name="password" onChange={this.handleInputChange} /></label>
        </div>
        <button onClick={this.handleSignIn} className="button-steez">Sign in</button>
        <button onClick={this.handleSignUp} className="button-steez">Sign up</button>
      </div>
    );
  }
}

/* props = modalIsOpen, onAfterOpen, onRequestClose, style, contentLabel, categories, addItem */
export class AddItemModal extends Component {
  constructor(props){
    super(props);

    this.state = {
      itemName: "",
      categoryName: ""
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
  }

  handleInputChange(event) {
    let target = event.target;
    if(target.name === "new-item-name"){
      this.setState({
        itemName: target.value
      });
    }
    else if(target.name === "new-item-category"){
      this.setState({
        categoryName: target.value
      });
    }
  }

  handleAddItem(event) {
    event.preventDefault();
    let itemName = this.state.itemName.trim();

    if(itemName !== ""){
      let actualCategory = findCategoryByName(this.state.categoryName, this.props.categories);
      this.props.addItem(itemName, actualCategory);
      this.props.onRequestClose();
    }
  }

  componentWillReceiveProps(){
    if(this.props.categories){
      this.setState({
        categoryName: this.props.categories[0].name
      });
    }
  }

  render() {
    var categoriesToShow = [];
    if(this.props.categories){
      this.props.categories.forEach((category) => {
        categoriesToShow.push(<option value={category.name} key={category.id}>{category.name}</option>)
      });
    }

    // @TODO: if there are no categories yet, the modal must reflect this, i.e. by not allowing the user to add an uncategorised item
    
    return(
      <Modal
        isOpen={this.props.modalIsOpen}
        onAfterOpen={this.props.onAfterOpen}
        onRequestClose={this.props.onRequestClose}
        contentLabel="Add item"
        className="modal-steez"
        overlayClassName="modal-overlay-steez"
      >

        <h2 style={{display: "inline"}} ref="subtitle">Add item</h2>
        <span className="modal-close" onClick={this.props.onRequestClose}>x</span>
        <div className="form-group">
          <label htmlFor="new-item-name">Your item's name</label>
          <input type="text" name="new-item-name" onChange={this.handleInputChange}/>
        </div>
        <div className="form-group">
          <label htmlFor="new-item-category">Your item's category</label>
          <select name="new-item-category" onChange={this.handleInputChange}>
            {categoriesToShow}
          </select>
        </div>
        <button className="button-steez" onClick={this.handleAddItem}>Add item!</button>
        
      </Modal>
    );
  }
}

/* props = modalIsOpen, onAfterOpen, onRequestClose, style, contentLabel, addCategory */
export class AddCategoryModal extends Component {
  constructor(){
    super();

    this.state = {
      categoryName: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
  }

  handleInputChange(event) {
    let target = event.target;
    this.setState({
      categoryName: target.value
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

  render() {
    return(
      <Modal
        isOpen={this.props.modalIsOpen}
        onAfterOpen={this.props.onAfterOpen}
        onRequestClose={this.props.onRequestClose}
        contentLabel="Add category"
        className="modal-steez"
        overlayClassName="modal-overlay-steez"
      >

        <h2 ref="subtitle" style={{display: "inline"}}>Add category</h2>
        <span className="modal-close" onClick={this.props.onRequestClose}>x</span>
        
        <div className="form-group">
          <label htmlFor="new-category-name">Your category's name</label>
          <input type="text" name="new-category-name" onChange={this.handleInputChange}/>
        </div>
        <button className="button-steez" onClick={this.handleAddCategory}>Add category!</button>
        
      </Modal>
    );
  }
}