import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Shipment extends Document {
  @Prop()
  messages: string;

  @Prop()
  sessionId: string;
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);
