import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop()
  _id: string;

  @Prop()
  resource: string;

  @Prop()
  user_id: number;

  @Prop()
  topic: string;

  @Prop()
  application_id: number;

  @Prop()
  attempts: number;

  @Prop()
  sent: Date;

  @Prop()
  received: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
