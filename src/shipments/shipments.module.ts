import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipment, ShipmentSchema } from './schemas/shipment.schema';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsGateway } from './shipments.gateway';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Shipment.name,
        schema: ShipmentSchema,
      },
    ]),
    AdminModule,
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentsService, ShipmentsGateway],
  exports: [ShipmentsGateway],
})
export class ShipmentsModule {}
