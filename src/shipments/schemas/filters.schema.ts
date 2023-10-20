import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Filters extends Document {
  @Prop()
  deliveryType: string[];

  @Prop()
  deliveryPreferences: string[];

  @Prop()
  sellerAddress: string[];

  @Prop()
  seller: string[];

  @Prop()
  deliveryTime: string[];

  @Prop()
  status: string[];
}

export const FiltersSchema = SchemaFactory.createForClass(Filters);
