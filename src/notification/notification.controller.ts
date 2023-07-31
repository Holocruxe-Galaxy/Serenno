import {
  Controller,
  HttpCode,
  Post,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationDto } from './dto/notification.dto';
import { NotificationInterceptor } from './notification.interceptor';

@UseInterceptors(NotificationInterceptor)
@Controller('notification')
export class NotificationController {
  @Post()
  @HttpCode(200)
  // eslint-disable-next-line
  notification(@Body() notificationDto: NotificationDto) {
    return 'Ok';
  }
}
