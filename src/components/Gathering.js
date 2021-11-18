import { Items } from './Items';
import { points } from './Points';
import { getCords } from '../utilities/engine';
import { send } from '../utilities/send';

export class Gathering {
  constructor(hero) {
    this.isHeroMoving = false;
    this.excluded = [];

    this.hero = hero;
    
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  getNearest() {
    const { hero } = this;

    const groundItems = Items.getGroundItems().filter(item => !this.excluded.includes(item.d.id));

    if (!groundItems.length) {
      this.excluded = [];
      return mAlert('Nie ma żadnych przedmiotów do zebrania');
    }

    const { index } = points(getCords(groundItems)).getNearestTo(hero.getX(), hero.getY());

    return groundItems[index];
  }

  start() {
    const { hero } = this;

    this.collecting = setInterval(() => {
      if (this.isHeroMoving) return;

      const item = this.getNearest();
      const { d: { x, y, id } } = item;

      if (points.isOutOfReach(x, y)) {
        this.excluded.push(id);

        return;
      }

      this.isHeroMoving = true;

      hero.follow(item, () => {
        setTimeout(() => {
          send('takeitem', { id: item.i.id }, () => {
            this.isHeroMoving = false;
          })
        }, 200);
      })
    }, 1000);
  }

  stop() {
    clearInterval(this.collecting);
    this.hero.stop();
  }
}
