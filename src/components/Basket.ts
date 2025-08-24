import { ensureElement, createElement } from "../utils/utils";
import { Component } from "./base/component";
import { EventEmitter } from "./base/events";

interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected itemsContainer: HTMLElement;
  protected totalContainer: HTMLElement;
  protected buttonContainer: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter){
    super(container);

    this.itemsContainer = ensureElement('.basket__list', container) as HTMLElement;
    this.totalContainer = ensureElement('.basket__price', container) as HTMLElement;
    this.buttonContainer = ensureElement('.basket__button', container) as HTMLElement;

    this.buttonContainer.addEventListener('click', () => {
      events.emit('order:open');
    })

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.itemsContainer.replaceChildren(...items);
      this.setDisabled(this.buttonContainer, false);
    }
    else {
      this.itemsContainer.replaceChildren(createElement('p', { 
      textContent: 'Корзина пуста'}) as HTMLParagraphElement);
      this.setDisabled(this.buttonContainer, true);
    }
  }

  set total(total: number) {
    this.setText(this.totalContainer, `${total} синапсов`);
  }
}