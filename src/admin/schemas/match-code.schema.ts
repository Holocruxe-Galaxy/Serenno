import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PasswordListType } from '../types/password.type';

@Schema()
export class MatchCode extends Document {
  @Prop()
  code: PasswordListType;

  @Prop()
  used: boolean;
}

export const MatchCodeSchema = SchemaFactory.createForClass(MatchCode);
