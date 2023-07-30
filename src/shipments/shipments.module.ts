import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsGateway } from './shipments.gateway';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [ShipmentsController],
  providers: [ShipmentsService, ShipmentsGateway],
  exports: [ShipmentsGateway],
})
export class ShipmentsModule {}
