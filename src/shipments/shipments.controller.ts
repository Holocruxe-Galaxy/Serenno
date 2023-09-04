import { Controller, Get, Post, Body } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { LostNotificationDto } from 'src/notification/dto/notification.dto';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}
  @Post()
  findMissingNotification(@Body() token: LostNotificationDto) {
    return this.shipmentsService.create(token, token as any);
  }

  @Get()
  findAll() {
    return this.shipmentsService.findAll();
  }
}
