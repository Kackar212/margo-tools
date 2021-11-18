import { send } from '../utilities/send';

export class Battle {
  constructor() {
    this.canAuto = true;

    this.startAutoFight = this.startAutoFight.bind(this);
    this.onShowCloseBattle = this.onShowCloseBattle.bind(this);
    this.addOnCloseListener(() => {
      this.attackRequestSended = false
    });
  }

  leave() {
    send('fight', { a: 'quit' });
  }

  isAuto() {
    return Engine.battle.isAuto;
  }

  retry(ad, auto) {
    if (this.retryTimeout) clearTimeout(this.retryTimeout);

    this.retryTimeout = setTimeout(() => {
      if (!Engine.battle.show) {
        this.attackRequestSended = false;
        this.startFight(id, auto);
      }
    }, 400);
  }

  startFight(id, auto = true) {
    this.canAuto = auto;

    if (!this.attackRequestSended) {
      this.attackRequestSended = true;
      send('fight', { a: 'attack', id: `-${id}` }, (e) => {
        if (Engine.battle) {
          this.retry(id, auto);
        }
      });
    }
  }

  autoFight() {
    send('fight', { a: 'f' });
  }

  startAutoFight() {
    if (!this.isAuto() && this.canAuto) {
      this.autoFight();
    }
  }

  addOnCloseListener(cb) {
    this.onClose = cb.bind(this);
  }

  onShowCloseBattle() {
    this.leave();
  }

  init() {
    API.addCallbackToEvent('open_battle_window', this.startAutoFight);
    API.addCallbackToEvent('show_close_battle', this.onShowCloseBattle);
    if (this.onClose) API.addCallbackToEvent('close_battle', this.onClose);
  }
}