import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Filters, FiltersSchema } from './schemas/filters.schema';
import { Shipment, ShipmentSchema } from './schemas/shipment.schema';

import { ShipmentsController } from './shipments.controller';
import { ShipmentsGateway } from './shipments.gateway';
import { ShipmentsService } from './shipments.service';

import { AdminModule } from 'src/admin/admin.module';
import { OrdersModule } from 'src/orders/orders.module';
import { NotificationModule } from 'src/notification/notification.module';

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
    MongooseModule.forFeature([
      {
        name: Filters.name,
        schema: FiltersSchema,
      },
    ]),
    AdminModule,
    OrdersModule,
    forwardRef(() => NotificationModule),
  ],
  controllers: [ShipmentsController],
  providers: [ShipmentsService, ShipmentsGateway],
  exports: [ShipmentsService, ShipmentsGateway],
})
export class ShipmentsModule {}
