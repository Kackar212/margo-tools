export function _URL(type, params) {
  const preparedParams = Object.entries(params).map(([key, value]) => `${key}${value === undefined ? '' : `=${value}`}`).join('&');
  
  return [type, preparedParams].join('&');
}


export function send(type, params = {}, cb = undefined) {
  _g(_URL(type, params), cb);
}
