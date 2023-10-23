export interface CoreData {
  id: number | string;
  buyer: string;
  address: string;
  zipCode: string;
  deliveryPreferences: string;
  seller: string;
  sellerAddress: string;
  deliveryTime: string;
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  status: string;
  deliveryType: string;
  order?: number | string;
}
