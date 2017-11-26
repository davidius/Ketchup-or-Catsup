import React, { Component } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import ItemList from './ItemList';
import {findItemsByCategory} from '../js/functions.js';

/* displays all the ItemLists */
/* props = items, categories, deleteItem, openEditItemModal */
export default class ListOfLists extends Component {
  render(){
    let listToReturn = [];
    const { categories, items, deleteItem, openEditItemModal } = this.props;
    if(categories){
      categories.forEach((category) => {
        if(findItemsByCategory(category, items).length > 0){
          listToReturn.push(<ItemList key={category.id} category={category} items={findItemsByCategory(category, items)} deleteItem={deleteItem}
          openEditItemModal={openEditItemModal}/>);
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
