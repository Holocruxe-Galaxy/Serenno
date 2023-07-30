import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Admin extends Document {
  @Prop()
  grant_type: string;

  @Prop()
  refresh_token: string;

  @Prop()
  client_id: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
