import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { OrderRoot } from '../interfaces/order.interface';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: SchemaTypes.Mixed })
  order: OrderRoot;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
