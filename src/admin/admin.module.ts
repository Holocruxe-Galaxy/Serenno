import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import {
  Refresh,
  RefreshSchema,
  MatchCode,
  MatchCodeSchema,
  Token,
  TokenSchema,
  Verifier,
  VerifierSchema,
} from './schemas';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature(
      [
        {
          name: Refresh.name,
          schema: RefreshSchema,
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
    MongooseModule.forFeature(
      [
        {
          name: Verifier.name,
          schema: VerifierSchema,
        },
      ],
      'ADMIN',
    ),
    MongooseModule.forFeature(
      [
        {
          name: MatchCode.name,
          schema: MatchCodeSchema,
        },
      ],
      'ADMIN',
    ),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
