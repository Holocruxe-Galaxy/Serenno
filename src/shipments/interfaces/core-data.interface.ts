export interface CoreData {
  id: number;
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
  sellingId?: string;
}
