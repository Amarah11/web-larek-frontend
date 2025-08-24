export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  categoty: string;
  price: number | null;
}

export interface IBasket {
  products: string[];
  total: number;
}

export interface IOrder {
  payment: TPaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export type TOrderForm = Omit<IOrder, 'total' | 'items'>;

export type TPaymentMethod = 'card' | 'cash' | '';

export interface IBasketIndex {
  index: number
}

export type TCard = IProduct & IBasketIndex;

export interface IOrderResult {
  id: string,
  total: number
}