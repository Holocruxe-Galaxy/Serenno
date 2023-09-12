import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { LostNotificationDto } from 'src/notification/dto/notification.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @Post()
  findMissingNotification(
    @Body() token: Pick<LostNotificationDto, 'access_token' | 'user_id'>,
  ) {
    return this.ordersService.populate(token as any);
  }

  // @Get()
  // findAll() {
  //   return this.ordersService.populate();
  // }
}
