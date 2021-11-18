import { getFromPath, put } from '../utilities/object';

class Settings {
  settings = {
    loot: '',
    autoAttack: {
      levelRange: [1, 999],
      numberOfMonstersInGroup: 999,
      canAttackGroup: true,
      nick: '',
    },
    autoHeal: {
      useSlots: [true, true, true, true, true, true, true, true],
      lowHp: 50,
      okHp: 80,
    }
  };

  constructor() {
    const margoToolsSettings = JSON.parse(localStorage.getItem('margo-tools-settings'));
    if (!margoToolsSettings) {
      localStorage.setItem('margo-tools-settings', this);
      this.settings = JSON.parse(localStorage.getItem('margo-tools-settings'));
    }

    this.settings = margoToolsSettings;
  }

  set(key, value) {
    put(key, this.settings, value);

    localStorage.setItem('margo-tools-settings', this);
  }

  get(path) {
    return getFromPath(path, this.settings);
  }

  toString() {
    return JSON.stringify(this.settings);
  }
}

const settings = new Settings();

export default settings;
