# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание проекта 

Проект Web-ларек реализует пример типового интернет-магазина. Пользователь может просматривать список товаров, 
добавлять/убирать товары из корзины, а также заказывать. Проект реализован на TypeScript и представляет собой SPA(Single Page Application)
c использованием API для получения данных о товарах.

Особенности реализации: — пользователь имеет возможность добавить в корзину и купить не более 1 единицы товара за 1 раз;
В каталоге есть товары, которые являются бесценными и их невохможно добавить в корзину/купить.

 ## Описание интерфейса 

 Интерфейс можно условно разделить на 3 процесса:
 1. Просмотр каталога товаров
 2. Добавление(удаление) товара в корзину
 3. Оформление заказа

## Структура проекта 

.
├── src/
│   ├── common.blocks/ [Стили компонент верстки]
│   ├── components/ [Реализация]
│   │   ├── base/ [Базовый код]
│   │   ├── [Модели данных и АПИ, Модель представления]
│   ├── images/
│   ├── pages/
│   │   ├── index.html [Основная страница и шаблоны компонент]
│   ├── types/ [Типизация]
│   │   ├── index.ts/ [Интерфейсы]
│   ├── utils/
│   │   ├── constants.ts [Настройки проекта]
│   │   ├── utils.ts [Утилиты]


## Интерфейсы данных

### Интерфейс описывающий товар `IProduct`

```typescript
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  categoty: string;
  price: number | null;
}
```
Данный интерфейс содержит в себе такие свойства, как:
1.  `category` - категория товара
2.  `title` - название товара
3.  `image` - картинка
4.  `price` - цена товара 
5.  `id` - идентификатор товара
6.  `description` - описание товара

### Интерфейс, частисно описывающий товар, лежащий в корзине `IBasketIndex`

```typescript
interface IBasketIndex {
  index: number
}
```
Создан для того чтобы описать товар, лежащий в корзине(у него, в отличие от товаров на страничке и в модалке, нужна нумерация)
Данный интерфейс содержит в себе такие свойства, как:
1.  `index` - индекс товара

### Интерфейс описывающий корзину `IBasket`

```typescript
interface IBasket {
  products: string[];
  total: number;
}
```

Данный интерфейс описывает такие свойства, как:
1. `products` - массив идентефикаторов продуктов в корзине
2.  `total` - сумма товаров в корзине

### Интерфейс описывающий заказ, отправляемый на сервер `IOrder`

```typescript
interface IOrder {
  payment: TPaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}
```
Данный интерфейс содержит в себе такие свойства, как:
1.  `items` - массив идентефикаторов товаров, которые пользователь заказал
2.  `payments` - способ оплаты: онлайн/при получении
3.  `address` - адрес доставки
4.  `email` - почта покупателя 
5.  `phone` - телефон покупателя 
6.  `total` - итоговая сумма в заказе

### Интерфейс описывающий промис, который отдается при отправке товара на сервер `IOrderResult`

```typescript
interface IOrderResult {
  id: string,
  total: number
}
```
Данный интерфейс содержит в себе такие свойства, как:
1.  `id` -  идентефикатор товаров, которые пользователь заказал
2.  `total` - итоговая сумма в заказе


### Тип данных `TOrderForm`

```typescript
type TOrderForm = Omit<IOrder, 'total' | 'items'>
```

Создается на основе интерфейса `IOrder`, но исключает свойства total и items.
Нужен для создания класса `OrderForm`(в нем нам не нужны items и total)

### Тип данных `TPaymentMethod`

```typescript
type TPaymentMethod = 'card' | 'cash' | ''
```

Создан для использования в методах модели 

### Тип данных `TCard`

Создается на основе двух интерфейсов `IProduct` и `IBasketCard`
Нужен для типизации карточек товара 

```typescript 
type ICard = IProduct & IBasketIndex;
```


## Применяемый паттерн: MVP

### Model (Модель данных) 
часть приложения, которая работает с данными, проводит вычисления и руководит всеми бизнес-процессами.
 
### View (представление) 
часть приложения, показывающая пользователю интерфейс и данные из модели на экране.
 
### Presenter (Представитель)
часть приложения, которая обеспечивает связь, является посредником между моделью и видом.

## Модели данных

### Класс `ProductModel`

Данный класс необходим для работы с моделью данных всего приложения
```typescript
class ProductModel {
  products: IProduct[]; // каталог товаров
  preview: IProduct; // карточка для отображения в модальном окне
  basket: IBasket = { // корзина
    products: [], // продуктя в корзине
    total: 0 // итоговая сумма в корзине
  };
  order: IOrder = { // заказ
    payment: 'card', // способ оплаты(по умолчанию card)
    email: '', // email покупателя
    phone: '', // телефон покупателя
    address:'', // адрес покупателя
    total: 0,  // итоговая сумма заказа(по умолчанию 0)
    items: [] //товары(по умолчанию их нет)
  };
  formErrors: Partial<Record<keyof TOrderForm, string>> = {}; //ошибки при валидации формы

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]) {} // получает массив товаров

  getProduct(id: string):IProduct {} // отдает товар по id

  setPrewiew(product:IProduct) {} // для показа превью карточки в модальном окне

  inBasket(item: IProduct) {} // для проверки наличия товара в корзине

  addToBasket(item: IProduct) {} // добавление в корзину

  removeFromBasket(item: IProduct) {} // удаление из корзины

  clearBasket() {} // очистка корзины

  setPaymentMethod(method:TPaymentMethod) {} // выбор метода оплаты 

  setOrderField(field: keyof TOrderForm, value: string) {} // готовит данные пользователя к отправке

  validateOrderForms() {} // валидация формы
}
```

### Класс ProductApi

Не относится к модели данных, предназначен для работы с API сервера

```typescript
class ProductApi extends Api {
  readonly cdn: string; // для загрузки карттинок с сервера

  constructor(cdn:string, baseUrl: string) {
    super(baseUrl),
    this.cdn = cdn;
  }

  getProducts() {} // получение товаров с сервера

  orderProducts() {} // отправка заказа пользователя на сервер
}
```


## Компоненты представления 

В компонеты представления входят базовые классы:
`api.ts` - для работы с API, 
`component.ts` - описывает компоненты и методы работы с ними(setText, setDisabled, ...) 
`event.ts` - для работы с событиями
`form.ts` - универсальный класс для работы с формами 

### Класс `Card.ts`

Предназначен для описание карточки товара, ее свойств и методов
Наследуется от базового типа `Component`, который типизируется дженериком типа `TCard` 

```typescript
interface ICardActions {
  onclick: (event: MouseEvent) => void;
}

class Card extends Component<IBasketCard> {
  protected cardTitle: HTMLElement; // название карточки
  protected cardPrice: HTMLElement; // цена
  protected cardCategory?: HTMLElement; // категория товара(необязательное свойство)
  protected cardImage?: HTMLImageElement; // картинка товара(необязательное свойство)
  protected cardButton?: HTMLButtonElement; // кнопка (необязательное свойство)
  protected cardDescription?: HTMLElement; // описание товара(необязательное свойство)
  protected cardIndex?: HTMLElement; // индекс карточки в корзине(необязательное свойство)

  // конструктор принмает в контейнере HTMLElement и actions(c типизацией интерфейсом ICardAcrions) для того чтобы регаировать на события MouseEvent пользователя
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    // дальше идет поиск элементов на страничке с помощью ensureElemet(те, которые есть в любой карточке) и querySelector(которые необязательны)
    ...
    // обработчик события 
    if(actions?.onclick) {}
  }

  set title(value:string) {} // устанавливаем значение в cardTitle

  get title():string {} // получаем название карточки чтобы потом установить его в alt для картинки

  set price(value:string) {} // устанавливаем цену и учитываем наличие бесценных товаров

  set category(value:string) {} // устанавливаем категорию товара и, в зависимости от нее, прописываем логику изменения отображения категории

  set image(value:string) {} // устанавливаем картинку 

  set description(value:string) {} // устанавливаем описание товара, которое будет использовано при событии 'prewiew:changed'

  set button(value:string) {} // устанавливаем кнопку для того, чтобы менять текст кнопки в зависимости от того, добавлен ли элемент в корзину

  set index(value:number) {} // устанавливаем index карточки, нужен для нумерации в корзине
}
```

### Класс `Basket.ts`

Предназначен для описание корзины товаров, ее свойств и методов
Наследуется от базового типа `Component`, который типизируется дженериком интерфейса `IBasketView` 

```typescript
interface IBasketView {
  items: HTMLElement[]; // массив всех HTMLElement  
  total: number; // итоговая сумма 
}

class Basket extends Component<IBasketView> {
  protected itemsContainer: HTMLElement; // свойство контейнерва товаров
  protected totalContainer: HTMLElement; // итоговая сумма 
  protected buttonContainer: HTMLElement; // кнопка в корзине

  // конструктор принмает в контейнере HTMLElement и events для работы с событиями
  constructor(container: HTMLElement, protected events: EventEmitter){
    super(container);

    // дальше идет поиск элементов на страничке
    ...
    // обрабатываем клик по кнопке и инициируем событие 
    this.buttonContainer.addEventListener('click', () => {
      events.emit('order:open');
    })

    // ставим начальное значение для массива элементов корзины
    this.items = [];
  }

  set items(items: HTMLElement[]) {} // метод заполняющий массив элементов корзины, принимает массив HTMLElement-ов, также включает в себя логику, в случае пустого массива

  set total(total: number) {} // метод устанавливающий итоговую сумму в корзине
}
```

### Класс `Modal.ts`

Предназначен для описание всех модальных окон, ее свойств и методов
Наследуется от базового типа `Component`, который типизируется дженериком интерфейса `IModal` 

```typescript
interface IModal {
  modalContent: HTMLElement;
}

class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement; // закрывающая модалку кнопка
  protected content: HTMLElement; // контент модального окна

  // конструктор принмает в контейнере HTMLElement и events для работы с событиями
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // дальше идет поиск элементов на страничке
    ...
    // обработчики события 'click'
    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this.content.addEventListener('click', (event) => event.stopPropagation());
  }

  set modalContent(value: HTMLElement) {} // устанавливаем контент

  open() {} // метод, открывающий модалку и инициирующий событие 'modal:open'(в нем блокируется прокрутка страницы)

  close() {} // метод, закрывающий модалку и инициирующий событие 'modal:close'(в нем разблокируется прокрутка страницы)

  render(data: IModal): HTMLElement {} // ренерит модалку, принимает данные интерфейса IModal и возвращает container с дженериком HTMLElement, также открывает модальное окно посредством метода open()
}
```

## Презентер

Так как в приложении всего одна страница, достаточно одного презентера. Код презентера не будет вынесен 
в отдельный класс, а будет размещен в основном скрипте приложения `index.ts`


## События 

Для осуществления связи между компонентами разных слоев будет использован событийно-ориентированный подход. 
Для его реализации будет использоваться базовый класс `EventEmitter`

Для примера работы подхода взял событие клика по товару и кнопке `Добавить в корзину`
1. В момент клика по одной из карточек. отрисованных на страничке, инициируется событие `card:select`, которое возвращает `item`, по которому произошел клик
2. Данное событие обрабатывается при помощи метода `events:on`, метод принимаем `item` и вызывает метод `setPrewiew` модели данных
3. Метод `setPrewiew` принмает кликнутый `product` и для него инициирует событие `preview:changed`
4. Данное событие создает экземпляр класса `Card`, реагирует на нажатие кнопки в этой карточке, а также рендерит нужное модальное окно и контент из карточек, добавленных в корзину