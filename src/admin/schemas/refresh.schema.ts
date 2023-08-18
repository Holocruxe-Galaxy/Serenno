import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Refresh extends Document {
  @Prop()
  grant_type: string;

  @Prop()
  refresh_token: string;

  @Prop()
  user_id: number;
}

export const RefreshSchema = SchemaFactory.createForClass(Refresh);
