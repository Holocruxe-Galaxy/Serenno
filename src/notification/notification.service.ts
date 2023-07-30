import { Injectable } from '@nestjs/common';
import { Notification } from './schemas/notification.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async create(notification: NotificationDto) {
    try {
      await this.notificationModel.create(notification);
      return;
    } catch (error) {
      if (error.code === 11000) return;
    }
  }
}
