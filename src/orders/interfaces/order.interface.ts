export interface OrderRoot {
  id: number;
  status: string;
  status_detail: any;
  date_created: string;
  date_closed: string;
  order_items: OrderItem[];
  total_amount: number;
  currency_id: string;
  buyer: Buyer;
  seller: Seller;
  payments: Payment[];
  feedback: Feedback;
  context: Context;
  shipping: Shipping;
  tags: string[];
}

export interface OrderItem {
  item: Item;
  quantity: number;
  unit_price: number;
  currency_id: string;
}

export interface Item {
  id: string;
  title: string;
  variation_id: any;
  variation_attributes: any[];
}

export interface Buyer {
  id: string;
  nickname: string;
  first_name: string;
  last_name: string;
}

export interface Seller {
  id: string;
}

export interface Payment {
  id: string;
  transaction_amount: number;
  currency_id: string;
  status: string;
  date_created: any;
  date_last_modified: any;
}

export interface Feedback {
  purchase: any;
  sale: any;
}

export interface Context {
  channel: string;
  site: string;
  flows: number[];
}

export interface Shipping {
  id: number;
}
