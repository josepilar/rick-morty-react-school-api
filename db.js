const { v4: uuid } = require('uuid');
let lists = [{ id: uuid(), name: 'favories', items: []}];

const findList = id => {
  const index = lists.findIndex(list => list.id === id);
  const list = lists.find(list => list.id === id);
  if (!list) throw new Error('List not found');
  return { index, list };
};

const updateList = (index, newList) => {
  lists.splice(index, 1, newList);
};

const findItem = (id, list) => {
  const foundItem = list.items.find(item => item.id === id);
  if (!foundItem) throw new Error(`Item not found in list \'${list.name}\'`);
  return foundItem;
};

module.exports = {
  lists: {
    get: id => {
      if (!id) return lists;
      return findList(id).list;
    },
    delete: id => {
      findList(id); // this is just to find the list and throw an error in case it doesn't exist.
      lists = lists.filter(list => list.id !== id);
      return { id };
    },
    post: name => {
      const newList = { id: uuid(), name, items: []};
      lists = [...lists, newList];
      return newList;
    },
    put: (id, name) => {
      const { index, list } = findList(id);
      const newList = {...list, name};      
      updateList(index, newList);
      return newList;
    }
  },
  items: {
    post: (listId, itemId, itemType) => {
      const { index, list } = findList(listId);
      const newItem = { itemId: itemId, type: itemType, id: uuid() };
      const newList = {...list, items: [...list.items, newItem]};
      updateList(index, newList);
      return newItem;
    },
    delete: (listId, id) => {
      const { index, list } = findList(listId);
      findItem(id, list);
      const newList = {...list, items: [...list.items.filter(item => item.id !== id)]};
      updateList(index, newList);
      return { id };
    },
    get: (listId, id) => {
      const { list } = findList(listId);
      if (!id) return list.items;
      const foundList = findItem(id, list);
      return foundList;
    }
  }
};
