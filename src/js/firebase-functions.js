export function addItem(name, category){
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

export function saveItem(item, newName, newTag){
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

export function addCategory(name){
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

export function deleteItem(item){
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
