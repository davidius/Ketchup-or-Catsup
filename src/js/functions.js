function getAssociatedId(id){
  var index = id.lastIndexOf("-");
  id = id.slice(index + 1);
  return id;
}

function findItemById(id, items){
  var matchingItem;
  if(items){
    items.forEach((item) => {
      if(item.id === id){
        matchingItem = item;
      }
    });
  }
  return matchingItem;
}

function findItemsByCategory(category, items){
  var matchingItems = [];
  if(items){
    items.forEach((item) => {
      if(item.tagId === category.id){
        matchingItems.push(item);
      }
    });
  }
  return matchingItems;
}

function findCategoryById(id, categories){
  var matchingCategory;
  if(categories){
    categories.forEach((category) => {
      if(category.id === id){
        matchingCategory = category;
      }
    });
  }
  return matchingCategory;
}

function findCategoryByName(name, categories){
  var matchingCategory = false;
  if(categories){
    categories.forEach((category) => {
      if(category.name === name){
        matchingCategory = category;
      }
    });
  }
  return matchingCategory;
}

function findListById(id, lists){
  let matchingList;
  if(lists){
    lists.forEach((list) => {
      if(list.id === id){
        matchingList = list;
      }
    });
  }
  return matchingList;
}

function findListByName(name, lists){
  let matchingList = false;
  if(lists){
    lists.forEach((list) => {
      if(list.name === name){
        matchingList = list;
      }
    });
  }
  return matchingList;
}

function exists(thing) {
  return typeof thing !== "undefined" && typeof thing !== "null" ? true : false;
}

export {getAssociatedId, findItemById, findItemsByCategory, findCategoryById, findCategoryByName, findListByName, findListById, exists};
