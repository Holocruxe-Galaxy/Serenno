export interface Seller {
  id: number;
  nickname: string;
  registration_date: string;
  first_name: string;
  last_name: string;
  gender: string;
  country_id: string;
  email: string;
  identification: Identification;
  address: Address;
  phone: Phone;
  alternative_phone: AlternativePhone;
  user_type: string;
  tags: string[];
  logo: any;
  points: number;
  site_id: string;
  permalink: string;
  seller_experience: string;
  bill_data: BillData;
  seller_reputation: SellerReputation;
  buyer_reputation: BuyerReputation;
  status: Status;
  secure_email: string;
  company: Company;
  credit: Credit;
  context: Context;
  registration_identifiers: any[];
}

export interface Identification {
  number: string;
  type: string;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface Phone {
  area_code: string;
  extension: string;
  number: string;
  verified: boolean;
}

export interface AlternativePhone {
  area_code: string;
  extension: string;
  number: string;
}

export interface BillData {
  accept_credit_note: any;
}

export interface SellerReputation {
  level_id: any;
  power_seller_status: any;
  transactions: Transactions;
  metrics: Metrics;
}

export interface Transactions {
  canceled: number;
  completed: number;
  period: string;
  ratings: Ratings;
  total: number;
}

export interface Ratings {
  negative: number;
  neutral: number;
  positive: number;
}

export interface Metrics {
  sales: Sales;
  claims: Claims;
  delayed_handling_time: DelayedHandlingTime;
  cancellations: Cancellations;
}

export interface Sales {
  period: string;
  completed: number;
}

export interface Claims {
  period: string;
  rate: number;
  value: number;
}

export interface DelayedHandlingTime {
  period: string;
  rate: number;
  value: number;
}

export interface Cancellations {
  period: string;
  rate: number;
  value: number;
}

export interface BuyerReputation {
  canceled_transactions: number;
  tags: any[];
  transactions: Transactions2;
}

export interface Transactions2 {
  canceled: Canceled;
  completed: any;
  not_yet_rated: NotYetRated;
  period: string;
  total: any;
  unrated: Unrated;
}

export interface Canceled {
  paid: any;
  total: any;
}

export interface NotYetRated {
  paid: any;
  total: any;
  units: any;
}

export interface Unrated {
  paid: any;
  total: any;
}

export interface Status {
  billing: Billing;
  buy: Buy;
  confirmed_email: boolean;
  shopping_cart: ShoppingCart;
  immediate_payment: boolean;
  list: List;
  mercadoenvios: string;
  mercadopago_account_type: string;
  mercadopago_tc_accepted: boolean;
  required_action: any;
  sell: Sell;
  site_status: string;
  user_type: any;
}

export interface Billing {
  allow: boolean;
  codes: any[];
}

export interface Buy {
  allow: boolean;
  codes: any[];
  immediate_payment: ImmediatePayment;
}

export interface ImmediatePayment {
  reasons: any[];
  required: boolean;
}

export interface ShoppingCart {
  buy: string;
  sell: string;
}

export interface List {
  allow: boolean;
  codes: any[];
  immediate_payment: ImmediatePayment2;
}

export interface ImmediatePayment2 {
  reasons: any[];
  required: boolean;
}

export interface Sell {
  allow: boolean;
  codes: any[];
  immediate_payment: ImmediatePayment3;
}

export interface ImmediatePayment3 {
  reasons: any[];
  required: boolean;
}

export interface Company {
  brand_name: any;
  city_tax_id: string;
  corporate_name: string;
  identification: string;
  state_tax_id: string;
  cust_type_id: string;
  soft_descriptor: any;
}

export interface Credit {
  consumed: number;
  credit_level_id: string;
  rank: string;
}

export interface Context {
  ip_address: string;
}
