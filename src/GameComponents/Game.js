import { getFromPath, put } from '../utilities/object';

export class Game {
  static extend(originalPath, extendFunction) {
    const keys = originalPath.split('.');

    keys.pop();

    const thisArg = getFromPath(keys.join('.'), Engine);
    const originalMethod = getFromPath(originalPath, Engine);

    if (!originalMethod) {
      return put(originalPath, Engine, extendFunction);
    }

    put(originalPath, Engine, async (...args) => {
      const result = await originalMethod.apply(thisArg, args);
      extendFunction(...args);

      return result;
    });
  }
}