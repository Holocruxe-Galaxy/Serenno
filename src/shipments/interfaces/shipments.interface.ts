export interface Shipment {
  id: number;
  external_reference: string;
  status: string;
  substatus: string;
  date_created: string;
  last_updated: string;
  declared_value: number;
  dimensions: Dimensions;
  logistic: Logistic;
  source: Source;
  tracking_number: string;
  origin: Origin;
  destination: Destination;
  lead_time: LeadTime;
  tags: string[];
}

export interface Dimensions {
  height: number;
  width: number;
  length: number;
  weight: number;
}

export interface Logistic {
  direction: string;
  mode: string;
  type: string;
}

export interface Source {
  site_id: string;
  market_place: string;
  application_id: any;
}

export interface Origin {
  type: string;
  sender_id: number;
  shipping_address: ShippingAddress;
}

export interface ShippingAddress {
  id: number;
  address_id: number;
  address_line: string;
  street_name: string;
  street_number: number;
  comment: string;
  zip_code: string;
  city: City;
  state: State;
  country: Country;
  neighborhood: Neighborhood;
  municipality: Municipality;
  types: Types;
  agency: Agency;
  latitude: number;
  longitude: number;
  geolocation_type: string;
  is_valid_for_carrier: boolean;
}

export interface City {
  id: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
}

export interface Country {
  id: string;
  name: string;
}

export interface Neighborhood {
  id: string;
  name: string;
}

export interface Municipality {
  id: string;
  name: string;
}

export interface Types {
  default_buying_address: number;
}

export interface Agency {
  carrier_id: number;
  agency_id: string;
  description: string;
  phone: string;
  open_hours: string;
}

export interface Destination {
  type: string;
  receiver_id: number;
  receiver_name: string;
  receiver_phone: string;
  comments: string;
  shipping_address: ShippingAddress2;
}

export interface ShippingAddress2 {
  id: number;
  address_id: number;
  address_line: string;
  street_name: string;
  street_number: number;
  comment: string;
  zip_code: string;
  city: City2;
  state: State2;
  country: Country2;
  neighborhood: Neighborhood2;
  municipality: Municipality2;
  types: Types2;
  agency: Agency2;
  latitude: number;
  longitude: number;
  geolocation_type: string;
  is_valid_for_carrier: boolean;
}

export interface City2 {
  id: string;
  name: string;
}

export interface State2 {
  id: string;
  name: string;
}

export interface Country2 {
  id: string;
  name: string;
}

export interface Neighborhood2 {
  id: string;
  name: string;
}

export interface Municipality2 {
  id: string;
  name: string;
}

export interface Types2 {
  default_buying_address: number;
}

export interface Agency2 {
  carrier_id: number;
  agency_id: string;
  description: string;
  phone: string;
  open_hours: string;
}

export interface LeadTime {
  option_id: number;
  shipping_method: ShippingMethod;
  currency_id: string;
  cost: number;
  cost_type: string;
  service_id: number;
  estimated_delivery_time: EstimatedDeliveryTime;
}

export interface ShippingMethod {
  id: number;
  type: string;
  name: string;
  deliver_to: string;
}

export interface EstimatedDeliveryTime {
  type: string;
  date: string;
  shipping: number;
  handling: number;
  unit: string;
  offset: Offset;
  time_frame: TimeFrame;
  pay_before: string;
}

export interface Offset {
  date: string;
  shipping: number;
}

export interface TimeFrame {
  from: number;
  to: number;
}
