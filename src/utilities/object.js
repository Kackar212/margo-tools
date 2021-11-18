export function getFromPath(path, obj) {
  if (!path) return obj;
  path = path.replace(/\[/g, '.').replace(/\]/g, '');
  
  const keys = path.split('.');

  return keys.reduce((result, key) => {
    return result[key];
  }, obj);
}

window.getFromPath = getFromPath;

export function put(path, obj, value) {
  path = path.replace(/\[/g, '.').replace(/\]/g, '');

  const keys = path.split('.');
  let o = obj;

  keys.forEach((key, index) => {
    if (keys.length - 1 === index) {
      o[key] = value;
      return;
    }

    o = o[key];
  });
}
