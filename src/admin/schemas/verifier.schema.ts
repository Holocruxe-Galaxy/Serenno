import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PasswordListType } from '../types/password.type';

@Schema()
export class Verifier extends Document {
  @Prop()
  verifier: string;

  @Prop()
  password: PasswordListType;
}

export const VerifierSchema = SchemaFactory.createForClass(Verifier);
