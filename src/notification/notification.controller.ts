import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';
import { NotificationInterceptor } from './notification.interceptor';

@UseInterceptors(NotificationInterceptor)
@Controller('notification')
export class NotificationController {
  @Post()
  // eslint-disable-next-line
  notification(@Body() notificationDto: NotificationDto) {
    return 'Ok';
  }
}
