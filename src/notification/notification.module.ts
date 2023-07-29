import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { ShipmentsModule } from 'src/shipments/shipments.module';

@Module({
  imports: [ShipmentsModule],
  controllers: [NotificationController],
})
export class NotificationModule {}
