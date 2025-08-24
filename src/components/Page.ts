import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";

interface IPage {
  catalog: HTMLElement[];
  locked: boolean;
  counter: number;
}

export class Page extends Component<IPage> {
  protected wrapperContainer: HTMLElement;
  protected catalogContainer: HTMLElement;
  protected counterContainer: HTMLElement;
  protected basketContainer: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents){
    super(container);

    this.wrapperContainer = ensureElement('.page__wrapper') as HTMLElement;
    this.catalogContainer = ensureElement('.gallery') as HTMLElement;
    this.counterContainer = ensureElement('.header__basket-counter') as HTMLElement;
    this.basketContainer = ensureElement('.header__basket') as HTMLButtonElement;

    this.basketContainer.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter (value: number) {
    this.setText(this.counterContainer, String(value));
        
  }

  set catalog (products: HTMLElement[]) {
    this.catalogContainer.replaceChildren(...products);    
  }

  set locked(value: boolean) {
    if (value) {
      this.wrapperContainer.classList.add('page__wrapper_locked');
    } else {  this.wrapperContainer.classList.remove('page__wrapper_locked') }
  }
} 