import { IBasket, IProduct, TOrderForm, TPaymentMethod } from "../types";
import { IEvents } from "./base/events";

export class ProductModel {
  products: IProduct[];
  preview: IProduct;
  basket: IBasket = {
    products: [],
    total: 0
  };
  order: TOrderForm = {
    payment: 'card',
    email: '',
    phone: '',
    address:'',
  };
  formErrors: Partial<Record<keyof TOrderForm, string>> = {};

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]) {
    this.products = products;
    this.events.emit('products:changed', this.products);
  }

  getProduct(id: string):IProduct {
    return this.products.find(item => item.id === id);
  }

  setPrewiew(product:IProduct) {
    this.preview = product;
    this.events.emit('preview:changed', this.preview);
  }

  inBasket(item: IProduct) {
    return this.basket.products.includes(item.id);
  }

  addToBasket(item: IProduct) {
    this.basket.products.push(item.id);
    this.basket.total += item.price;
    this.events.emit('basket:changed', this.basket);
  }

  removeFromBasket(item: IProduct) {
    this.basket.products = this.basket.products.filter(id => id !== item.id);
    this.basket.total -= item.price;
    this.events.emit('basket:changed', this.basket);
  }

  clearBasket() {
    this.basket.products = [];
    this.basket.total = 0;
    this.events.emit('basket:changed', this.basket);
  }

  setPaymentMethod(method:TPaymentMethod) {
    this.order.payment = method;
  }

  setOrderField(field: keyof TOrderForm, value: string) {
    if(field === 'payment') {
      this.setPaymentMethod(value as TPaymentMethod);
    } else { this.order[field] = value};

    if(this.order.payment && this.validateOrderForms()) {
      this.events.emit('order:ready', this.order);
    }
  }

  validateOrderForms() {
    const errors: typeof this.formErrors = {};
    if(!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }
    if(!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if(!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    if(!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:changed', this.formErrors);
    return Object.keys(errors).length === 0;
  }
}