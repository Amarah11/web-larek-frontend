import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";
import { IEvents } from "./base/events";

interface IModal {
  modalContent: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement('.modal__close', container) as HTMLButtonElement;
    this.content = ensureElement('.modal__content', container) as HTMLElement;

    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this.content.addEventListener('click', (event) => event.stopPropagation());
  }

  set modalContent(value: HTMLElement) {
    this.content.replaceChildren(value)
  }

  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open')
  }

  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close')
  }

  render(data: IModal): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}