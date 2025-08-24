import { TOrderForm } from "../types";
import { Form } from "./base/form";

export class ContactForm extends Form<TOrderForm> {
  set email(value:string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }

  set phone(value:string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }
}