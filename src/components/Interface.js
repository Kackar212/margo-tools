import settings from './Settings';
import { loadTemplates } from '../templates/loadTemplates';

export class Interface {
  static Load() {
    this.getTemplate = API.Templates.get;
    this.document = loadTemplates();

    return this.document;
  }

  static addWidgetButton() {
    const { slot, container } = Engine.widgetManager.getFirstEmptyWidgetSlot();

    const openWindowButton = this.get('#openWindowBtn');
    openWindowButton.on('click', () => !this.wnd.isShow() ? this.wnd.show() : this.wnd.hide());
    openWindowButton.css({
      left: `${slot * 44}px`,
      position: 'left',
    })

    Engine.widgetManager.addToAttachWidgetList('margo-tools', openWindowButton);

    const emptySlot = $(`.${container} .empty-slot-widget`).eq(slot);
    emptySlot.replaceWith(openWindowButton);
  }

  static initWindow() {
    const content = this.get('.window-content');

    const startBotBtn = this.get('#startBOT');
    startBotBtn.on('click', this.bot.start);

    const stopBotBtn = this.get('#stopBOT');
    stopBotBtn.on('click', this.bot.stop);

    const startGathering = this.get('#startCollecting');
    startGathering.on('click', this.gathering.start);

    const stopGathering = this.get('#stopCollecting');
    stopGathering.on('click', this.gathering.stop);

    content
    .find('.margo-bot .buttons-container')
    .append([startBotBtn, stopBotBtn])

    content
    .find('.margo-gathering .buttons-container')
    .append([startGathering, stopGathering]);

    this.formSettings = this.get('#settings');

    this.formSettings.on('submit', (e) => {
      e.preventDefault();

      const { currentTarget } = e;
      const inputs = $(currentTarget).find('input');

      inputs.each((_, element) => {
        const input = $(element);

        const path = input.prop('name');
        const type = input.prop('type');

        if (type === 'checkbox' || type === 'radio') {
          return settings.set(path, input.prop('checked'));
        }
      
        settings.set(path, input.val());
      })
    })

    content
    .find('.settings')
    .append(this.formSettings)

    this.initializeSettings();

    Engine.windowsData.name.MARGO_BOT = 'MARGO_BOT';

    this.wnd = Engine.windowManager.add({
      content,
      title: 'Margo Tools',
      nameWindow: 'MARGO_BOT',
      widget: "MARGO_BOT",
      managePosition: {
          x: "251",
          y: "60"
      },
      onclose: () => {
          this.wnd.hide();
      }
    });

    this.wnd.addToAlertLayer();
    this.wnd.hide();
  }

  static initializeSettings() {
    this.formSettings
    .find('input')
    .each((_, element) => {
      const input = $(element);

      const path = input.prop('name');
      const type = input.prop('type');

      const defaultValue = settings.get(path);

      if (type === 'checkbox' || type === 'radio') {
        return input.prop('checked', defaultValue);
      }
      
      input.val(defaultValue);
    });
  }

  static init(bot, gathering) {
    this.bot = bot;
    this.gathering = gathering;
  }

  static get(selector) {
    return $(selector, this.document).clone();
  }
}
