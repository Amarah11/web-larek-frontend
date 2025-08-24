import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import { Page } from './components/Page';
import { ProductApi } from './components/ProductApi';
import { ProductModel } from './components/ProductModel';
import { IProduct, TOrderForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactForm } from './components/ContactForm';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new ProductApi(CDN_URL, API_URL);

// темплейты
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPrewiewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const orderFormTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;


// модель данных приложения
const productModel =  new ProductModel(events);

// глобальные контейнеры
const page = new Page(document.querySelector('.page__wrapper') as HTMLElement, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);
const basket = new Basket(cloneTemplate(basketTemplate) as HTMLElement, events);
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate) as HTMLFormElement, events);
const contactForm = new ContactForm(cloneTemplate(contactFormTemplate) as HTMLFormElement, events);

// получаем лоты с сервера
api.getProducts()
  .then(productModel.setProducts.bind(productModel))
  .catch(err => {
    console.log(err);
  })

  // изменились элементы каталоа
events.on('products:changed', (items: IProduct[]) => {
  page.catalog = items.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onclick: () => events.emit('card:select', item)
    });
    return card.render(item);
  })
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// открыть лот
events.on('card:select', (item: IProduct) => {
  productModel.setPrewiew(item);
});

// изменен открытый выбранный лот
events.on('preview:changed', (item: IProduct) => {  
  const card = new Card(cloneTemplate(cardPrewiewTemplate), {
    onclick: () => {
      if(productModel.inBasket(item)) {
        productModel.removeFromBasket(item);
        card.button = 'В корзину';
      } else {
          productModel.addToBasket(item);
          card.button = 'Удалить из корзины';
      }
    }
  });
  card.button = productModel.inBasket(item) ? 'Удалить из корзины' : 'В корзину';
  modal.render({
    modalContent:card.render(item)
  })
});

// открытие корзины
events.on('basket:open', () => {
  modal.render({
    modalContent:basket.render()
  })
});

// изменения в корзине
events.on('basket:changed', () => {
  page.counter = productModel.basket.products.length;  
  basket.items = productModel.basket.products.map((id, index) => {
    const item = productModel.getProduct(id);
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      onclick: () => productModel.removeFromBasket(item)
    });    
    return card.render({
      title: item.title, 
      price: item.price,
      index: index,
    });
  }),
  basket.total = productModel.basket.total;  
});

// открытие формы оформления адреса доставки
events.on('order:open', () => {
  modal.render({
    modalContent:orderForm.render({
      payment: 'card',
      address: '',
      valid: false,
      errors: []
    })
  })
});

// открытик формы контактов 
events.on('order:submit', () => {
  modal.render({
    modalContent:contactForm.render({
      email: '',
      phone: '',
      valid: false,
      errors: [],
    })
  })
})

events.on('order:ready', () => {
  contactForm.valid = true;
})

// Изменилось одно из полей формы order
events.on(/^order\..*:changed/, (data: { field: keyof TOrderForm, value: string }) => {
    productModel.setOrderField(data.field, data.value);
});

// Изменилось одно из полей формы contact
events.on(/^contacts\..*:changed/, (data: { field: keyof TOrderForm, value: string }) => {
    productModel.setOrderField(data.field, data.value);
});

// Изменилось состояние валидации формы
events.on('formErrors:changed', (errors: Partial<TOrderForm>) => {
  const { payment, address, email, phone} = errors;
  orderForm.valid = !payment && !address;
  orderForm.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
  contactForm.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
    api.orderProducts(productModel.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    productModel.clearBasket();
                }
            });

            modal.render({
                modalContent: success.render(result)
            });
        })
        .catch(err => {
            console.error(err);
        });
});