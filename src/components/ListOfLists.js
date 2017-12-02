import React, { Component } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import ItemList from './ItemList';
import {findItemsByCategory} from '../js/functions.js';

/* displays all the ItemLists */
/* props = items, categories, deleteItem, openEditItemModal, listToShow */
export default class ListOfLists extends Component {
  render(){
    let listToReturn = [];
    const { categories, items, deleteItem, openEditItemModal, listToShow } = this.props;
    const listId = listToShow ? listToShow.id : undefined;
    const itemsInList = items ? items.filter(item => item.listId === listId) : undefined;
    if(categories){
      categories.forEach((category) => {
        if(findItemsByCategory(category, itemsInList).length > 0){
          listToReturn.push(<ItemList
            key={category.id}
            category={category}
            items={findItemsByCategory(category, itemsInList)}
            deleteItem={deleteItem}
            openEditItemModal={openEditItemModal}
          />);
        }
      });
    }

    return(
      <div className="list-of-lists-steez">
        {
          listToShow ? <h1>{listToShow.name}</h1> : null
        }
        {
          itemsInList && itemsInList.length > 0 ?
          <CSSTransitionGroup
            transitionName="item-list"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            {listToReturn}
          </CSSTransitionGroup> : <p>{`You don't have any items in this list. Click the "+" button to fix this :-)`}</p>
        }

      </div>
    );
  }
}
