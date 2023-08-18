import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Token extends Document {
  @Prop()
  access_token: string;

  @Prop()
  user_id: number;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
