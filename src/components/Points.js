import { hero } from './index';

export function points(points) {
  function getDistances(x, y) {
    return points.map(
      (point) => ({
        distance: Math.floor(
          Math.sqrt(
            Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
          )
        ),
        index: point.index,
      })
    )
  }

  return {
    getNearestTo(x, y) {
      const distances = getDistances(x, y);

      const { index } = distances.sort(
        ({ distance: a }, { distance: b }) => a - b
      )[0];

      return { ...points[index], index };
    },
  }
}

points.create = (x, y) => {
  return {
    x,
    y,
  }
}

points.isNear = function (pointA, pointB) {
  const onX = Math.abs(pointA.x - pointB.x) <= 1;
  const onY = Math.abs(pointB.y - pointA.y) <= 1;
  
  return onX && onY;
}

points.isOutOfReach = function (x, y) {
  const nativeHero = hero.getNative();

  const autoPath = asdasd.find(nativeHero, this.create(x, y));
  const destination = autoPath.road.shift();

  const isHeroNear = points.isNear(this.create(x, y), nativeHero.d);
  if (!destination && !isHeroNear) return true;

  return !points.isNear({ x, y }, destination);
}
