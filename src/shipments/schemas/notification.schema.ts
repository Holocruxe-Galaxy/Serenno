import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop()
  resource: string;

  @Prop()
  sessionId: string;

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
