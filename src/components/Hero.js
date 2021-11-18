import { Game } from '../GameComponents/Game';
import { Monsters } from './Monsters';
import { points } from './Points';
import { getFromPath } from '../utilities/object';

export class Hero {
  constructor(settings, battle) {
    this.hero = Engine.hero;
    this.data = 
    this.stats = this.hero.d.warrior_stats;
    this.settings = settings.get('autoHeal');
    this.battle = battle;

    this.previousMonster = null;

    this.onPositionChange = this.onPositionChange.bind(this);
    this.updateHero = this.updateHero.bind(this);
    this.stop = this.stop.bind(this);
  }

  getNative(key = undefined) {
    return key ? getFromPath(key, this.hero) : this.hero;
  }

  getX() {
    return this.hero.d.x;
  }

  getY() {
    return this.hero.d.y;
  }

  getPosition() {
    return { x: this.getX(), y: this.getY() };
  }

  getCurrentHp() {
    return this.stats.hp;
  }

  getMaxHp() {
    return this.stats.maxhp;
  }

  getId() {
    return this.hero.d.id;
  } 

  isHpLow() {
    const { settings: { lowHp } } = this;
    return this.getCurrentHp() / this.getMaxHp() * 100 <= lowHp;
  }

  isHpOK() {
    const { settings: { okHp } } = this;

    return this.getCurrentHp() / this.getMaxHp() * 100 >= okHp;
  }

  follow(element, afterFollow) {
    Engine.hero.addAfterFollowAction(element, afterFollow);
  }

  move(x, y) {
    this.hero.autoGoTo({ x, y });
    const { x: dX, y: dY } = Engine.map.goMark || this.getPosition();

    this.heroIsMoving = true;
    this.destination = [dX, dY];

    if (this.isMonsterNearPlayer(x, y)) {
      this.onPositionChange(dX, dY);
    }
  }

  stop() {
    this.hero.clearAutoPathOfHero();
    this.isAutoAttackOn = false;
    this.heroIsMoving = false;
    this.destination = null;
  }

  isMonsterNearPlayer(x, y, heroDestination = {}) {
    const heroX = heroDestination.x || this.getX();
    const heroY = heroDestination.y || this.getY();

    return points.isNear(points.create(x, y), points.create(heroX, heroY));
  }

  go(monster) {
    const { d: { x, y } } = monster;

    if (this.heroIsMoving) {
      return;
    }

    this.isAutoAttackOn = true;
    this.monster = monster;

    this.move(x, y);
  }

  onPositionChange(x, y) {
    if (!this.destination) return;
    if (!this.isAutoAttackOn && this.heroIsMoving) return;
    if (x !== this.destination[0] && y !== this.destination[1]) return;

    const { battle } = this;

    this.destination = null;

    const { d: { id }} = this.monster;

    setTimeout(
      () => !Monsters.isAggresive(this.monster) && battle.startFight(id),
      250
    );
  }

  updateHero(hero) {
    this.hero = hero;   
    this.stats = hero.d.warrior_stats;
  }

  init() {
    Game.extend('hero.onPositionChange', this.onPositionChange);
    API.addCallbackToEvent('heroUpdate', this.updateHero);
    API.addCallbackToEvent('close_battle', this.stop);
  }
}
