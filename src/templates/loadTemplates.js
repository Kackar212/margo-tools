import index from './index.html';
import settings from './settings.html';
import crafting from './crafting.html';
import groundItems from './ground-items.html';

const loadTemplates = () => {
  const templates = [index, settings, crafting, groundItems];
  const documentFragment = document.createDocumentFragment();

  templates.forEach(html => {
    const template = document.createElement('template');

    template.innerHTML = html;

    [...template.content.children].forEach(child => {
      documentFragment.appendChild(child);
    });
  });

  return documentFragment;
}

export { loadTemplates };
