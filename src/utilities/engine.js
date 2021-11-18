export function getCords(gameElements) {
  return gameElements.map(({ d: { x, y } }, index) => ({ x, y, index }));
}