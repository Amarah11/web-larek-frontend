import { IOrder, IOrderResult, IProduct } from "../types";
import { Api, ApiListResponse } from "./base/api";

export class ProductApi extends Api {
  readonly cdn: string;

  constructor(cdn:string, baseUrl: string) {
    super(baseUrl),
    this.cdn = cdn;
  }

  getProducts():Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) => 
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    )
  }
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then(
      (data: IOrderResult) => data
      );
    }
}