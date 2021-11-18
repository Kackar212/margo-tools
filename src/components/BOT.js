import { points } from './Points';

export class BOT {
  constructor(hero, monsters, autoHeal) {
    this.hero = hero;
    this.monsters = monsters;
    this.autoHeal = autoHeal;

    this.container = new Map();

    this.isWorking = false;
    this.monster = null;
    this.canAttackNextMonster = true;

    this.autoAttack = this.autoAttack.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  start() {
    if (this.isWorking) return;

    this.isWorking = true;
    
    this.interval = setInterval(() => {
      if (!this.hero.isHpLow()) this.autoAttack();
      else this.autoHeal.heal();
    }, 500);
  }

  isMonsterOutOfReach() {
    const { d: { x, y } } = this.monster;

    return points.isOutOfReach(x, y);
  }

  autoAttack() {
    if (!this.isWorking || !this.canAttackNextMonster) return;

    this.monster = this.monster || this.monsters.getNearestMonster();

    if (!this.monster) return;

    if (this.isMonsterOutOfReach()) {
      this.monsters.addExcluded(this.monster);
      this.monster = null;

      return;
    }

    this.hero.go(this.monster);
    this.canAttackNextMonster = false;
  }

  stop() {
    if (!this.isWorking) return;

    this.hero.stop();
    this.isWorking = false;
    clearInterval(this.interval);
    this.monster = null;
    this.canAttackNextMonster = true
  }

  init() {
    API.addCallbackToEvent('close_battle', () => {
      this.monster = null;
      setTimeout(() => {
        if (Engine.dead) {
          this.stop();

          return;
        }
        
        this.canAttackNextMonster = true
      }, 500);
    });
  }
}
