import { EventEmitter } from "./base/events";
import { ensureElement } from "../utils/utils";
import { Form } from "./base/form";
import { TOrderForm, TPaymentMethod } from "../types";

export class OrderForm extends Form<TOrderForm> {
    protected paymentCard: HTMLButtonElement;
    protected paymentCash: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container, events);

        this.paymentCard = ensureElement('.button_alt[name=card]', container) as HTMLButtonElement;
        this.paymentCash = ensureElement('.button_alt[name=cash]', container) as HTMLButtonElement;

        this.paymentCard.addEventListener('click', () => {
            this.payment = 'card',
            this.onInputChange('payment', 'card');
        });

        this.paymentCash.addEventListener('click', () => {
            this.payment = 'cash',
            this.onInputChange('payment', 'cash');
        })
    }

    set payment(value:TPaymentMethod) {
        this.paymentCard.classList.toggle('button_alt-active', value === 'card');
        this.paymentCash.classList.toggle('button_alt-active', value === 'cash');
    }

    set address(value:string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}