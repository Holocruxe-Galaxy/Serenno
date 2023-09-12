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
      const exists = await this.notificationModel.findOneAndUpdate(
        {
          resource: notification.resource,
        },
        notification,
      );

      if (!exists) {
        return await this.notificationModel.create(notification);
      }
    } catch (error) {
      if (error.code === 11000) return;
    }
  }

  async findByTopic(topic: string) {
    return await this.notificationModel.find({ topic }).sort({ received: -1 });
  }
}
