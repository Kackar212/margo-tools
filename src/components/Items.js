import { getFromPath } from '../utilities/object';

export class Items {
  static getItem(element, key = 'id') {
    if (typeof element !== 'object') {
      return this.item = this.getItemBy(key, element);
    }

    return this.item = element
      .find('.item')
      .data('item');
  }

  static getItemBy(key, value) {
    return this.getItems(key, value)[0];
  }

  static getGroundItems() {
    return Engine.map.groundItems.getDrawableItems();
  }

  static getItems(key = undefined, value = undefined) {
    this.items = Object.values(Engine.items.test().items);

    if (key) {
      return this.items.filter(item => getFromPath(key, item) == value);
    }
    
    return this.items;
  }

  static init() {
    this.getItems();
  }
}

Items.item = {};
Items.items = [];
