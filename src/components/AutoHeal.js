import { GameStorage } from '../GameComponents/GameStorage';
import { Items } from './Items';
import { send } from '../utilities/send';

export class AutoHeal {
  constructor(settings, hero) {
    this.hero = hero;
    this.settings = settings.get('autoHeal');
    this.currentSlot = null;

    this.heal = this.heal.bind(this);
  }

  getSlotIndex(side, index) {
    return side === 'r' ? Math.abs(3 - (index - 4)) : +index;
  }

  sortSlots(a, b) {
    return a.index - b.index;
  }

  getSlots(hero) {
    return GameStorage.getItemsInSlots(hero);
  }

  findUsedSlot(settings) {
    return ({ index }) => {
      const { useSlots } = settings;

      return useSlots[index];
    }
  }

  mapSlots(getSlotIndex) {
    return ([id, [side, index]]) => ({ id, index: getSlotIndex(side, index) });
  }

  getUsedSlot() {
    const {
      hero,
      settings,
      getSlotIndex,
      sortSlots,
      getSlots,
      findUsedSlot,
      mapSlots,
    } = this;

    const slots = Object.entries(getSlots(hero)).map(mapSlots(getSlotIndex)).sort(sortSlots);
    const { id } = slots.find(findUsedSlot(settings));
    
    return { id, amount: Items.getItem(id).getAmount() };
  }

  async heal() {
    const { hero } = this;
    if (hero.isHpOK()) {
      return;
    }

    this.currentSlot = this.currentSlot || this.getUsedSlot();

    if (!this.currentSlot) {
      mAlert('wszystkie sloty są pustę');
      return;
    }

    const { id } = this.currentSlot;
    this.decreaseAmount();

    send('moveitem', { st: 1, id }, this.heal);
    
    this.checkAmount();
  }

  decreaseAmount() {
    this.currentSlot.amount--;
  }

  checkAmount() {
    const { amount } = this.currentSlot;
    if (!amount) {
      this.currentSlot = null;
    }
  }

  init() {
    API.addCallbackToEvent('close_battle', () => this.hero.isHpLow() && this.heal())
  }
}