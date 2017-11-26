import React, { Component } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import ItemButton from './ItemButton';

/* a list of ItemButtons headed by the category in which those items appear */
/* props = category, items, deleteItem, openEditItemModal */
export default class ItemList extends Component {
  // needs a function that responds when a list item is clicked...

  render(){
    let itemsToShow = [];
    const { items, deleteItem, openEditItemModal, category } = this.props;
    items.forEach((item) => {
      itemsToShow.push(<ItemButton key={item.id} item={item} deleteItem={deleteItem} openEditItemModal={openEditItemModal}/>);
    });

    return(
      <div>
        <h2>{category.name}</h2>
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
