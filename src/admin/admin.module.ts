import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin } from 'mongodb';
import { AdminSchema } from './schemas/admin.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Admin.name,
          schema: AdminSchema,
        },
      ],
      'ADMIN',
    ),
    MongooseModule.forFeature(
      [
        {
          name: Token.name,
          schema: TokenSchema,
        },
      ],
      'TOKEN',
    ),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
