export interface Seller {
  id: number;
  user_id: number;
  location_id: any;
  contact: string;
  phone: string;
  address_line: string;
  floor: any;
  apartment: any;
  street_number: string;
  street_name: string;
  zip_code: string;
  city: City;
  state: State;
  country: Country;
  neighborhood: Neighborhood;
  municipality: Municipality;
  search_location: SearchLocation;
  types: string[];
  comment: any;
  between: any;
  references: any;
  aditional_info: any;
  geolocation_type: string;
  geolocation_last_updated: string;
  geolocation_source: string;
  latitude: number;
  longitude: number;
  status: string;
  date_created: string;
  normalized: boolean;
  open_hours: OpenHours;
  address_type: string;
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
  id: any;
  name: any;
}

export interface Municipality {
  id: any;
  name: any;
}

export interface SearchLocation {
  state: State2;
  city: City2;
  neighborhood: Neighborhood2;
}

export interface State2 {
  id: string;
  name: string;
}

export interface City2 {
  id: string;
  name: string;
}

export interface Neighborhood2 {
  id: string;
  name: string;
}

export interface OpenHours {
  monday: Monday[];
  tuesday: Tuesday[];
  wednesday: Wednesday[];
  thursday: Thursday[];
  friday: Friday[];
  on_holidays: OnHolidays;
}

export interface Monday {
  from: string;
  to: string;
}

export interface Tuesday {
  from: string;
  to: string;
}

export interface Wednesday {
  from: string;
  to: string;
}

export interface Thursday {
  from: string;
  to: string;
}

export interface Friday {
  from: string;
  to: string;
}

export interface OnHolidays {
  hours: any[];
  status: string;
}
