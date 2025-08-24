import { TCard } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";

interface ICardActions {
  onclick: (event: MouseEvent) => void;
}

export class Card extends Component<TCard> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;
  protected cardCategory?: HTMLElement;
  protected cardImage?: HTMLImageElement;
  protected cardButton?: HTMLButtonElement;
  protected cardDescription?: HTMLElement;
  protected cardIndex?: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.cardTitle = ensureElement('.card__title', container) as HTMLElement;
    this.cardPrice = ensureElement('.card__price', container) as HTMLElement;

    this.cardCategory = container.querySelector('.card__category') as HTMLElement;
    this.cardImage = container.querySelector('.card__image') as HTMLImageElement;
    this.cardDescription = container.querySelector('.card__text') as HTMLElement;
    this.cardButton = container.querySelector('.card__button') as HTMLButtonElement;
    this.cardIndex = container.querySelector('.basket__item-index') as HTMLElement;

    if(actions?.onclick) {
      if (this.cardButton) {
        this.cardButton.addEventListener('click', actions.onclick);
      } else {
        container.addEventListener('click', actions.onclick);
      }
    }
  }

  set title(value:string) {
    this.setText(this.cardTitle, value);
  }

  get title():string {
    return this.cardTitle.textContent;
  }

  set price(value:string) {
    this.setText(this.cardPrice, `${value} синапсов`);
    if(value === null) {
      this.setText(this.cardPrice, 'Бесценно');
      this.setText(this.cardButton, 'Недоступно')
      this.setDisabled(this.cardButton, true);
    }
  }

  set category(value:string) {
    this.setText(this.cardCategory, value);
    this.cardCategory.classList.toggle('card__category_soft', value === 'софт-скил');
    this.cardCategory.classList.toggle('card__category_other', value === 'другое');
    this.cardCategory.classList.toggle('card__category_additional', value === 'дополнительное');
    this.cardCategory.classList.toggle('card__category_hard', value === 'хард-скил');
    this.cardCategory.classList.toggle('card__category_button', value === 'кнопка');
  }

  set image(value:string) {
    const pngValue = value.replace('.svg', '.png');
    this.setImage(this.cardImage, pngValue, this.title);
  }

  set description(value:string) {
    this.setText(this.cardDescription, value)
  }

  set button(value:string) {
    this.setText(this.cardButton, value);
  }

  set index(value:number) {
    this.setText(this.cardIndex, value + 1)
  }
}