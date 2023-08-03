import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { CoreData, Item, Seller, Shipping } from '../interfaces';

@Schema({ timestamps: true })
export class Shipment extends Document {
  @Prop({ type: SchemaTypes.Mixed })
  shipment: Shipping;

  @Prop({ type: SchemaTypes.Mixed })
  item: Item;

  @Prop({ type: SchemaTypes.Mixed })
  seller: Seller;

  @Prop({ type: SchemaTypes.Mixed })
  coreData: CoreData;
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
