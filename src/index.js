import { Interface } from './components/Interface';
import { Game } from './GameComponents/Game';
import './assets/index.css';

window.requestAnimationFrame = function (callback) {
  return window.setTimeout(function () {
    callback(Date.now());
  }, 1000 / 60);
};

window.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};

setTimeout(() => {
  Interface.Load();

  document.addEventListener("visibilitychange", () => {
    Engine.browserCardManager.getChromeCardActive = () => true
  });

  Game.extend('widgetManager.addWidgetButtons', () => Interface.addWidgetButton());
}, 0);

window.addEventListener('load', async () => {
  await import(/* webpackMode: "eager" */ './components');

  Interface.initWindow();
});
