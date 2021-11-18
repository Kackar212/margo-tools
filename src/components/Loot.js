import { send } from '../utilities/send';

export class Loot {
  constructor(settings) {
    this.blacklist = settings.get('loot').split(',');
    this.decisions = {};
    
    this.acceptLoot = this.acceptLoot.bind(this);
  }

  acceptLoot(item) {
    if (this.blacklist.includes(item.name)) {
      this.decisions[item.id] = 'not';
    }

    this.numberOfLootItems--;

    if (this.numberOfLootItems === 0) {
      send(`loot${Engine.loots.lootUrl(this.decisions)}`, { final: 1 }, Engine.loots.close);
      this.decisions = {};
    }
  }

  init() {
    Engine.items.fetch(Engine.itemsFetchData.FETCH_NEW_LOOT_ITEM, this.acceptLoot);
    API.addCallbackToEvent('loot_update', () => this.numberOfLootItems = Object.keys(Engine.loots.statesOfLoot).length)
  } 
}
