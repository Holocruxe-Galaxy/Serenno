import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsGateway } from './shipments.gateway';

@Module({
  controllers: [ShipmentsController],
  providers: [ShipmentsService, ShipmentsGateway],
  exports: [ShipmentsGateway],
})
export class ShipmentsModule {}
