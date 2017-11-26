import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import './App.css';
import {HeadingBar, AddItemButton} from './js/components.js';
import SignInView from './components/SignInView';
import ListOfLists from './components/ListOfLists';
import AddItemModal from './components/AddItemModal';
import EditItemModal from './components/EditItemModal';
import AddCategoryModal from './components/AddCategoryModal';
import {findItemById} from './js/functions.js';
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyARzTuhAghdO_nrABRGNZIRbnZpiQoK4KE",
  authDomain: "shopping-list-357cd.firebaseapp.com",
  databaseURL: "https://shopping-list-357cd.firebaseio.com/",
  storageBucket: "shopping-list-357cd.appspot.com",
  messagingSenderId: "1098985413077"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

/* state = menuBarVisible, items, categories, lists, itemCurrentlyBeingEdited */
class App extends Component {
  constructor(){
    super();

    this.state = {
      componentToShow: null,
      signedIn: null,
      currentUid: null,
      items: null,
      categories: null,
      lists: null,
      menuBarVisible: false,
      addItemModalIsOpen: false,
      addCategoryModalIsOpen: false,
      editItemModalIsOpen: false,
      itemCurrentlyBeingEdited: 0,
      authenticationError: null
    };

    this.itemsRef = firebaseApp.database().ref();
    this.categoriesRef = firebaseApp.database().ref();
    this.listsRef = firebaseApp.database().ref();

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

    this.openEditItemModal = this.openEditItemModal.bind(this);
    this.afterOpenEditItemModal = this.afterOpenEditItemModal.bind(this);
    this.closeEditItemModal = this.closeEditItemModal.bind(this);
  }

  toggleMenuBar(){
    let visible = this.state.menuBarVisible;
    this.setState({menuBarVisible: !visible});
  }

  listenForDatabaseChange() {
    let firebaseItems = [];
    let firebaseCategories = [];
    let firebaseLists = [];

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

    this.listsRef.on('value', (snap) => {
      firebaseLists = [];
      if(snap){
        snap.forEach((child) => {
          firebaseLists.push(child.val());
        });
        this.setState({
          lists: firebaseLists
        });
      }
    });
    console.log(firebaseLists);
  }

  firebaseSignIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        this.setState({
          componentToShow: "Main",
          menuBarVisible: false,
        });
      }).catch((error) => {
        this.setState({
          authenticationError: error
        });
    });
  }

  firebaseSignUp(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      this.setState({
        componentToShow: "Main",
        menuBarVisible: false,
      });
    }).catch((error) => {
      this.setState({
        authenticationError: error
      });
    });
  }

  firebaseSignOut() {
    firebase.auth().signOut().catch((error) => {
      this.setState({
        authenticationError: error
      });
    });
  }

  addItem(name, category){
    let newItem = {};
    let arrayOfItemIds = [];
    let nextAvailableItemId;

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

    let matchKey = null;

    this.itemsRef.on('value', (snap) => {
      snap.forEach((child) => {
        if(child.val().id === item.id){
          matchKey = child.key;
        }
      });
    });

    if(matchKey != null){
      let itemToEditRef = this.itemsRef.child(matchKey);
      itemToEditRef.set(item);
    }
  }

  addCategory(name){
    console.log(`attempting to add ${name}`);
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
    let matchKey = null;

    this.itemsRef.once('value', (snap) => {
      snap.forEach((child) => {
        if(child.val().id === item.id){
          matchKey = child.key;
        }
      });
      if(matchKey != null){
        // let itemToDeleteRef = firebaseApp.database().ref("/users/" + currentUid + "/items/" + matchKey);
        let itemToDeleteRef = this.itemsRef.child(matchKey);
        itemToDeleteRef.remove();
      }
    });
  }

  openAddItemModal() {
    this.setState({addItemModalIsOpen: true});
  }

  closeAddItemModal() {
    this.setState({addItemModalIsOpen: false});
  }

  openEditItemModal(itemId) {
    const { items } = this.state;
    const item = findItemById(itemId, items);
    this.setState({
      itemCurrentlyBeingEdited: item
    }, () => {
      this.setState({
        editItemModalIsOpen: true
      });
    });
  }

  closeEditItemModal() {
    this.setState({
      editItemModalIsOpen: false,
      itemCurrentlyBeingEdited: 0
    });
  }

  openAddCategoryModal() {
    this.setState({
      addCategoryModalIsOpen: true,
      menuBarVisible: false
    });
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
      if (user){
        this.itemsRef = firebaseApp.database().ref("/users/" + user.uid + "/items/");
        this.categoriesRef = firebaseApp.database().ref("/users/" + user.uid + "/tags/");
        this.listsRef = firebaseApp.database().ref("/users/" + user.uid + "/lists/");
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
        <MuiThemeProvider>
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
              openEditItemModal={this.openEditItemModal}
            />
            <Drawer
              docked={false}
              width={200}
              open={this.state.menuBarVisible}
              onRequestChange={(menuBarVisible) => this.setState({menuBarVisible})}
              openSecondary={true}
            >
              <MenuItem onClick={this.openAddCategoryModal}>Add category</MenuItem>
              <MenuItem onClick={this.firebaseSignOut}>Log out</MenuItem>
            </Drawer>

            <AddItemModal
              modalIsOpen={this.state.addItemModalIsOpen}
              onRequestClose={this.closeAddItemModal}
              categories={this.state.categories}
              addItem={this.addItem}
            />

            <EditItemModal
              modalIsOpen={this.state.editItemModalIsOpen}
              onRequestClose={this.closeEditItemModal}
              categories={this.state.categories}
              editItem={this.saveItem}
              itemToEdit={this.state.itemCurrentlyBeingEdited}
            />

            <AddCategoryModal
              modalIsOpen={this.state.addCategoryModalIsOpen}
              onRequestClose={this.closeAddCategoryModal}
              addCategory={this.addCategory}
            />
          </div>
        </MuiThemeProvider>
      );
    }
    else if(this.state.componentToShow === "SignUp"){
      return(
        <MuiThemeProvider>
          <SignInView
            firebaseSignIn={this.firebaseSignIn}
            firebaseSignUp={this.firebaseSignUp}
          />
        </MuiThemeProvider>
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
