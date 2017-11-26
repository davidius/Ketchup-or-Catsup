import React, { Component } from 'react';
import '../styles.css';

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
    return(
      <span className="menu-button-steez" onClick={this.props.toggleMenuBar}></span>
    );
  }
}
