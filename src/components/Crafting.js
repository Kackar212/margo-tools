import { Interface } from './Interface';
import { send } from '../utilities/send';
import { Game } from '../GameComponents/Game';

export class Crafting {
  constructor() {
    this.repeat = 0;
    this.canCraftNextItem = true;
  
    this.extendRecipe = this.extendRecipe.bind(this);
    this.useRecipe = this.useRecipe.bind(this);
  }

  init() {
    Game.extend('communication.dispatcher.on_recipes', (recipes) => {
      const { crafting: { wnd: { $: craftingWindow }}} = Engine;
      this.craftingWindow = craftingWindow;
      this.maxQuantity = 0;

      $('.crafting-recipe-in-list', craftingWindow).click(this.extendRecipe);

      if (!this.isIinitialized) {
        this.appendInput();
      }

      this.recipes = recipes;
      this.isIinitialized = true;
    });

    API.addCallbackToEvent('newAsk', (data) => {
      const [{ re: response }, askWindow] = data;
      
      if (!response.startsWith('craft')) return;

      _g(`${response}1`, () => {
          askWindow.close();
          
          this.repeat--;
          $('.reagents-list .have', this.craftingWindow).text((_, prev) => +prev - 1);
          
          this.canCraftNextItem = true;

          if (this.repeat > 0) this.requestUseRecipe();
          else $(`.recipe-id-${this.recipe.id}`).click();
      });
    });
  }

  extendRecipe() {
    const { crafting: { recipes } } = Engine;

    const recipeId = recipes.getShowId();

    this.recipe = { id: recipeId, ...this.recipes[recipeId] };
    
    const ingredients = this.getIngredients().map(({ id, amount }) => {
      const realAmount = checkItemsAmount(id);
      return {
        amount: realAmount,
        id,
        max: Math.floor(realAmount / amount),
      } 
    });

    ingredients.forEach(({ id, amount }) => {
      const itemIngredient = $(`.item-id-${id}`, this.craftingWindow);

      itemIngredient
      .parents('.reagent-wrapper')
      .find('.have')
      .text(amount);
    });
    
    this.maxQuantity = Math.min(...ingredients.map(ingredient => ingredient.max));

    const maxQunatityInfo = Interface.get('.max-quantity-info').text(`Możesz stworzyć ${this.maxQuantity} przedmiotów`);
    const reagentsList = $('.reagents-list', this.craftingWindow).first();

    $('.max-quantity-info', this.craftingWindow).remove();
    reagentsList.prepend(maxQunatityInfo);

    this.replaceListenerInDoRecipeButton();
  }

  useRecipe(e) {
    $('body').addClass('auto-crafting');

    this.repeat = +this.quantityInput.val();

    if (this.repeat > 0) this.requestUseRecipe();
  }

  requestUseRecipe() {
    send('craft', { a: 'use', id: this.recipe.id });
  }

  replaceListenerInDoRecipeButton() {
    const btn = this.craftingWindow.find('.do-recipe .button');

    if (btn.hasClass('black')) return;
  
    btn.off().on('click', this.useRecipe);
  }

  getIngredients() {
    return Object.values(this.recipe.ingredients);
  }

  appendInput() {
    this.quantityInput = Interface.get('input.quantity').on('input', ({ target }) => {
      target = $(target);

      target.val((_, value) => {
        if (value > this.maxQuantity) {
          return this.maxQuantity;
        } else if (value <= 0) {
          return 0;
        }

        return value;
      })
    });

    this.craftingWindow.append(this.quantityInput);
  }
}
