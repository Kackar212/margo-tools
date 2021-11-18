import { hero } from '../components';

export class GameStorage {
  static getItemsInSlots() {
    return API.Storage.get(`bottomPanel/${hero.getId()}`);
  }
}
