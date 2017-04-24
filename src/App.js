import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import {ListOfLists, HeadingBar, AddItemButton, SideMenu, SignInView, AddItemModal, AddCategoryModal} from './js/components.js';
import './js/functions.js';
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyARzTuhAghdO_nrABRGNZIRbnZpiQoK4KE",
  authDomain: "shopping-list-357cd.firebaseapp.com",
  databaseURL: "https://shopping-list-357cd.firebaseio.com/",
  storageBucket: "shopping-list-357cd.appspot.com",
  messagingSenderId: "1098985413077"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
// const firebaseAppDatabase = firebaseApp.database();
// const firebaseAppAuth = firebaseApp.auth();

/* state = menuBarVisible, items, categories */
class App extends Component {
  constructor(){
    super();

    this.state = {
      componentToShow: null,
      signedIn: null,
      currentUid: null,
      items: null,
      categories: null,
      menuBarVisible: false,
      addItemModalIsOpen: false,
      addCategoryModalIsOpen: false
    };

    this.itemsRef = firebaseApp.database().ref();
    this.categoriesRef = firebaseApp.database().ref();

    this.toggleMenuBar = this.toggleMenuBar.bind(this);
    this.firebaseSignIn = this.firebaseSignIn.bind(this);
    this.firebaseSignUp = this.firebaseSignUp.bind(this);
    this.firebaseSignOut = this.firebaseSignOut.bind(this);
    this.addItem = this.addItem.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.addCategory = this.addCategory.bind(this);

    this.openAddItemModal = this.openAddItemModal.bind(this);
    this.afterOpenAddItemModal = this.afterOpenAddItemModal.bind(this);
    this.closeAddItemModal = this.closeAddItemModal.bind(this);

    this.openAddCategoryModal = this.openAddCategoryModal.bind(this);
    this.afterOpenAddCategoryModal = this.afterOpenAddCategoryModal.bind(this);
    this.closeAddCategoryModal = this.closeAddCategoryModal.bind(this);
  }

  toggleMenuBar(){
    let visible = this.state.menuBarVisible;
    this.setState({menuBarVisible: !visible});
  }

  listenForDatabaseChange() {
    var firebaseItems = []; 
    var firebaseCategories = [];
    
    this.categoriesRef.on('value', (snap) => {
      firebaseCategories = [];
      if(snap){
        snap.forEach((child) => {
          firebaseCategories.push(child.val());
        });
        this.setState({
          categories: firebaseCategories
        });
      }
    });

    this.itemsRef.on('value', (snap) => {
      firebaseItems = [];
      if(snap){
        snap.forEach((child) => {
          firebaseItems.push(child.val());
        });
        this.setState({
          items: firebaseItems
        });
      }
    });
  }

  firebaseSignIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
      console.log(error);
    });
  }

  firebaseSignUp(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      console.log("successfully signed in");
    }).catch((error) => {
      console.log(error);
    });
  }

  firebaseSignOut() {
    firebase.auth().signOut().catch((error) => {
      console.log(error);
    });
  }

  addItem(name, category){
    var newItem = {};
    var arrayOfItemIds = [];
    var nextAvailableItemId;

    if(this.state.items){
      this.state.items.forEach((item) => {
        arrayOfItemIds.push(item.id);
      });
    }
    else{
      arrayOfItemIds.push(0);
    }
    

    if(arrayOfItemIds.length > 0){
      nextAvailableItemId = Math.max(...arrayOfItemIds) + 1;
    }
    else{
      nextAvailableItemId = 0;
    }

    newItem.id = nextAvailableItemId;
    newItem.name = name;
    newItem.tagId = category.id;
    
    this.itemsRef.push(newItem);
  }

  saveItem(item, newName, newTag){
    item.name = newName;
    item.tagId = newTag.id;

    var matchKey = null;

    this.itemsRef.on('value', (snap) => {
      snap.forEach((child) => {
        if(child.val().id === item.id){
          matchKey = child.key;
        }
      });
    });

    if(matchKey != null){
      var itemToEditRef = this.itemsRef.child(matchKey);
      itemToEditRef.set(item);
    }
  }

  addCategory(name){
    console.log("about to add category: " + name);
    var newTag = {};
    var arrayOfTagIds = [];
    var nextAvailableTagId;

    if(this.state.categories){
      this.state.categories.forEach((tag) => {
        arrayOfTagIds.push(tag.id);
      });
    }
    else{
      arrayOfTagIds.push(0);
    }
    
    if(arrayOfTagIds.length > 0){
      nextAvailableTagId = Math.max(...arrayOfTagIds) + 1;
    }
    else{
      nextAvailableTagId = 0;
    }

    newTag.name = name;
    newTag.id = nextAvailableTagId;

    this.categoriesRef.push(newTag);
    return newTag;
  }

  deleteItem(item){
    var matchKey = null;

    this.itemsRef.once('value', (snap) => {
      snap.forEach((child) => {
        if(child.val().id === item.id){
          matchKey = child.key;
        }
      });
      if(matchKey != null){
        // var itemToDeleteRef = firebaseApp.database().ref("/users/" + currentUid + "/items/" + matchKey);
        var itemToDeleteRef = this.itemsRef.child(matchKey);
        itemToDeleteRef.remove();
      }
    });
  }

  openAddItemModal() {
    this.setState({addItemModalIsOpen: true});
  }

  afterOpenAddItemModal() {
    // references are now sync'd and can be accessed.
    // this.refs.subtitle.style.color = '#f00';
  }

  closeAddItemModal() {
    this.setState({addItemModalIsOpen: false});
  }

  openAddCategoryModal() {
    this.setState({addCategoryModalIsOpen: true});
  }

  afterOpenAddCategoryModal() {
    // references are now sync'd and can be accessed.
    // this.refs.subtitle.style.color = '#f00';
  }

  closeAddCategoryModal() {
    this.setState({addCategoryModalIsOpen: false});
  }

  componentWillMount(){
    // Listen to change in auth state so it displays the correct UI for when
    // the user is signed in or not.
    firebase.auth().onAuthStateChanged((user) => {
      // The observer is also triggered when the user's token has expired and is
      // automatically refreshed. In that case, the user hasn't changed so we should
      // not update the UI.
      if (user && user.uid === this.state.currentUid) {
        return;
      }
      if(user){
        this.itemsRef = firebaseApp.database().ref("/users/" + user.uid + "/items/");
        this.categoriesRef = firebaseApp.database().ref("/users/" + user.uid + "/tags/");
        this.setState({
          componentToShow: "Main",
          signedIn: true,
          currentUid: user.uid
        });
        this.listenForDatabaseChange();
      }
      else{
        this.setState({
          componentToShow: "SignUp",
          signedIn: false
        });
      }
    });
  }

  render() {
    if(this.state.componentToShow === "Main"){
      return(
        <div className="main-div-steez">
          <AddItemButton openAddItemModal={this.openAddItemModal}/>
          <HeadingBar
            toggleMenuBar={this.toggleMenuBar}
            menuBarVisible={this.state.menuBarVisible}
          />
          <ListOfLists 
            items={this.state.items} 
            categories={this.state.categories}
            deleteItem={this.deleteItem}
          />
          <SideMenu 
            isVisible={this.state.menuBarVisible} 
            firebaseSignOut={this.firebaseSignOut} 
            openAddCategoryModal={this.openAddCategoryModal}
          />
          <AddItemModal 
            modalIsOpen={this.state.addItemModalIsOpen} 
            onAfterOpen={this.afterOpenAddItemModal} 
            onRequestClose={this.closeAddItemModal} 
            categories={this.state.categories} 
            addItem={this.addItem}
          />
          <AddCategoryModal 
            modalIsOpen={this.state.addCategoryModalIsOpen} 
            onAfterOpen={this.afterOpenAddCategoryModal} 
            onRequestClose={this.closeAddCategoryModal} 
            addCategory={this.addCategory}
          />
        </div>
      );
    }
    else if(this.state.componentToShow === "SignUp"){
      return(
        <SignInView 
          firebaseSignIn={this.firebaseSignIn} 
          firebaseSignUp={this.firebaseSignUp}
        />
      );
    }
    else{
      return(
        <div></div>
      );
    }
  }
}

export default App;
