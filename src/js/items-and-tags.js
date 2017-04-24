function addItem(name, tag){
	console.log("about to add item...");

	var newItem = {};
	var arrayOfItemIds = [];
	var nextAvailableItemId;

	$.each(localItems, function(index, item){
		arrayOfItemIds.push(item.id);
	})
	
	if(arrayOfItemIds.length > 0){
		nextAvailableItemId = Math.max(...arrayOfItemIds) + 1;
	}
	else{
		nextAvailableItemId = 0;
	}

	newItem.id = nextAvailableItemId;
	newItem.name = name;
	newItem.tagId = tag.id;
	
	itemsRef.push(newItem);
	// copyDatabaseToLocal();
	// refresh();
}

function saveItem(item, newName, newTag){
	item.name = newName;
	item.tagId = newTag.id;

	var matchKey = null;

	itemsRef.on('value', (snap) => {
	  snap.forEach((child) => {
	  	if(child.val().id == item.id){
	  		matchKey = child.key;
	  	}
	  });
	});

	if(matchKey != null){
		var itemToEditRef = itemsRef.child(matchKey);
		itemToEditRef.set(item);
	}
}

function addTag(name){
	var newTag = {};
	var arrayOfTagIds = [];
	var nextAvailableTagId;

	tagsRef.on('value', (snap) => {
	  snap.forEach((child) => {
	  	arrayOfTagIds.push(child.val().id);
	  });
	});
	if(arrayOfTagIds.length > 0){
		nextAvailableTagId = Math.max(...arrayOfTagIds) + 1;
	}
	else{
		nextAvailableTagId = 0;
	}

	newTag.name = name;
	newTag.id = nextAvailableTagId;

	tagsRef.push(newTag);
	// copyDatabaseToLocal();
	return newTag;
}

function deleteItem(item){
	var matchKey = null;

	itemsRef.on('value', (snap) => {
	  snap.forEach((child) => {
	  	if(child.val().id == item.id){
	  		matchKey = child.key;
	  	}
	  });
	});

	if(matchKey != null){
		// var itemToDeleteRef = firebaseAppDatabase.ref("/users/" + currentUid + "/items/" + matchKey);
		var itemToDeleteRef = itemsRef.child(matchKey);
		itemToDeleteRef.remove();
	}
}