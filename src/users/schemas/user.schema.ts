import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop([String])
  name: string;

  @Prop([String])
  email: number;

  @Prop([String])
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
