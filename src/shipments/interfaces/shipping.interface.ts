export interface Shipping {
  snapshot_packing: SnapshotPacking;
  last_updated: string;
  items_types: string[];
  substatus: string;
  date_created: string;
  origin: Origin;
  destination: Destination;
  source: Source;
  tags: string[];
  declared_value: number;
  logistic: Logistic;
  sibling: Sibling;
  lead_time: LeadTime;
  external_reference: any;
  tracking_number: string;
  id: number;
  tracking_method: string;
  status: string;
  dimensions: Dimensions;
}

export interface SnapshotPacking {
  snapshot_id: string;
  pack_hash: string;
}

export interface Origin {
  shipping_address: ShippingAddress;
  type: string;
  sender_id: number;
  snapshot: Snapshot;
}

export interface ShippingAddress {
  country: Country;
  address_line: string;
  types: string[];
  scoring: any;
  agency: Agency;
  city: City;
  geolocation_type: string;
  latitude: number;
  address_id: number;
  municipality: Municipality;
  location_id: any;
  street_name: string;
  zip_code: string;
  geolocation_source: string;
  intersection: any;
  street_number: string;
  comment: any;
  state: State;
  neighborhood: Neighborhood;
  geolocation_last_updated: string;
  longitude: number;
}

export interface Country {
  id: string;
  name: string;
}

export interface Agency {
  carrier_id: any;
  phone: any;
  agency_id: any;
  description: any;
  type: any;
  open_hours: any;
}

export interface City {
  id: string;
  name: string;
}

export interface Municipality {
  id: any;
  name: any;
}

export interface State {
  id: string;
  name: string;
}

export interface Neighborhood {
  id: any;
  name: any;
}

export interface Snapshot {
  id: string;
  version: number;
}

export interface Destination {
  comments: any;
  receiver_id: number;
  receiver_name: string;
  shipping_address: ShippingAddress2;
  type: string;
  receiver_phone: string;
  snapshot: Snapshot2;
}

export interface ShippingAddress2 {
  country: Country2;
  address_line: string;
  types: string[];
  scoring: any;
  agency: Agency2;
  city: City2;
  geolocation_type: string;
  latitude: number;
  address_id: number;
  municipality: Municipality2;
  location_id: any;
  street_name: string;
  zip_code: string;
  geolocation_source: string;
  delivery_preference: string;
  intersection: any;
  street_number: string;
  comment: string;
  state: State2;
  neighborhood: Neighborhood2;
  geolocation_last_updated: string;
  longitude: number;
}

export interface Country2 {
  id: string;
  name: string;
}

export interface Agency2 {
  carrier_id: any;
  phone: any;
  agency_id: any;
  description: any;
  type: any;
  open_hours: any;
}

export interface City2 {
  id: string;
  name: string;
}

export interface Municipality2 {
  id: any;
  name: any;
}

export interface State2 {
  id: string;
  name: string;
}

export interface Neighborhood2 {
  id: any;
  name: any;
}

export interface Snapshot2 {
  id: string;
  version: number;
}

export interface Source {
  site_id: string;
  market_place: string;
  customer_id: any;
  application_id: any;
}

export interface Logistic {
  mode: string;
  type: string;
  direction: string;
}

export interface Sibling {
  reason: any;
  sibling_id: any;
  description: any;
  source: any;
  date_created: any;
  last_updated: any;
}

export interface LeadTime {
  processing_time: any;
  cost: number;
  estimated_schedule_limit: EstimatedScheduleLimit;
  cost_type: string;
  estimated_delivery_final: EstimatedDeliveryFinal;
  buffering: Buffering;
  list_cost: number;
  estimated_delivery_limit: EstimatedDeliveryLimit;
  priority_class: any;
  delivery_promise: string;
  shipping_method: ShippingMethod;
  delivery_type: string;
  estimated_handling_limit: EstimatedHandlingLimit;
  service_id: number;
  estimated_delivery_time: EstimatedDeliveryTime;
  option_id: number;
  estimated_delivery_extended: EstimatedDeliveryExtended;
  currency_id: string;
}

export interface EstimatedScheduleLimit {
  date: any;
}

export interface EstimatedDeliveryFinal {
  date: string;
  offset: number;
}

export interface Buffering {
  date: any;
}

export interface EstimatedDeliveryLimit {
  date: string;
  offset: number;
}

export interface ShippingMethod {
  name: string;
  deliver_to: string;
  id: number;
  type: string;
}

export interface EstimatedHandlingLimit {
  date: string;
}

export interface EstimatedDeliveryTime {
  date: Date;
  pay_before: string;
  schedule: any;
  unit: string;
  offset: Offset;
  shipping: number;
  time_frame: TimeFrame;
  handling: number;
  type: string;
}

export interface Offset {
  date: string;
  shipping: number;
}

export interface TimeFrame {
  from: any;
  to: any;
}

export interface EstimatedDeliveryExtended {
  date: string;
  offset: number;
}

export interface Dimensions {
  height: number;
  width: number;
  length: number;
  weight: number;
}
