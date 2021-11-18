import settings from './Settings';
import { AutoHeal } from './AutoHeal';
import { Battle } from './Battle';
import { BOT } from './Bot';
import { Crafting } from './Crafting';
import { Gathering } from './Gathering';
import { Hero } from './Hero';
import { Interface } from './Interface';
import { Loot } from './Loot';
import { Monsters } from './Monsters';
import { Items } from './Items';

const battle = new Battle();
const hero = new Hero(settings, battle);
const monsters = new Monsters(hero);
const loot = new Loot(settings);
const autoHeal = new AutoHeal(settings, hero);
const crafting = new Crafting();
const gathering = new Gathering(hero);
const bot = new BOT(hero, monsters, autoHeal);

[hero, battle, loot, autoHeal, crafting, bot, Items].forEach((component) => component.init());
Interface.init(bot, gathering);


export {  battle, hero, monsters, loot, autoHeal, crafting, gathering, bot, Interface };
