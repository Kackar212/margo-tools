import { points } from './Points';
import settings from './Settings';
import { getCords } from '../utilities/engine';
import { is } from '../utilities/types';

export class Monsters {
  constructor(hero) {
    this.hero = hero;
    
    this.excluded = [];
  }

  addExcluded({ d: { id } }) {
    this.excluded.push(id);
  }

  getNpcs() {
    return Object.values(Engine.npcs.check());
  }

  static getGroup(grp) {
    return Engine.npcs.getAllGroup()[grp]
  }

  isToManyMonstersInGroup(numberOfMonstersInGroup, grp) {
    return this.getNumberOfMonstersInGroup(grp) > numberOfMonstersInGroup;
  }

  isLvlOutOfRange(range, ...monsters) {
    return monsters.some(({ d: { lvl } }) => lvl < range[0] || lvl > range[1]);
  }

  getMonsters() {
    const { canAttackGroup, numberOfMonstersInGroup, nick, levelRange } = settings.get('autoAttack');
    const { isLvlOutOfRange, getNpcs } = this;

    return getNpcs().filter((npc) => {
      const { d: { type, id, grp, nick: monsterNick }} = npc;
      const isMonster = type === 2 || type === 3;
      const isExcluded = this.excluded.includes(id);
      
      if (!isMonster || isExcluded) return false;

      const isNickEmpty = nick === '';
      const isNickEqual = nick === monsterNick;

      if (!isNickEmpty && !isNickEqual) return false;

      const isInGroup = grp !== 0;
      if (isInGroup) {
        const group = Monsters.getGroup(grp);
        const isToManyMonsters = group.length > numberOfMonstersInGroup;

        return canAttackGroup && !isToManyMonsters && !isLvlOutOfRange(levelRange, ...group);
      }

      return true && !isLvlOutOfRange(levelRange, npc);
    });
  }

  static isAggresive({ d: { type, lvl, grp } }) {
    if (grp !== 0) {
      const group = this.getGroup(grp);
      return group.some(({ type, lvl }) => type === 3 && lvl >= Engine.hero.d.lvl - 1);
    }

    return type === 3 && lvl >= Engine.hero.d.lvl - 1;
  }

  getNearestMonster() {
    const { hero } = this;

    const monsters = this.getMonsters();

    if (!monsters.length) {
      this.excluded = [];
      return null;
    }

    const { index: monsterIndex } = points(getCords(monsters)).getNearestTo(hero.getX(), hero.getY())
  
    if (is(monsterIndex, 'undefined')) return null;

    return monsters[monsterIndex];
  }
}
