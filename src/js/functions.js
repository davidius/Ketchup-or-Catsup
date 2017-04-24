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

export {getAssociatedId, findItemById, findItemsByCategory, findCategoryById, findCategoryByName};