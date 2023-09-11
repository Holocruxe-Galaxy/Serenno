import { Injectable } from '@nestjs/common';
import { OrderRoot } from './interfaces/order.interface';
import { Order } from './schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly shippingModel: Model<Order>,
  ) {}
  create(createOrderDto: OrderRoot) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  private async checkIfExists(resource: string) {
    const id = Number(resource.split('/')[2]);

    return await this.shippingModel.findOne({ 'coreData.id': id });
  }
}
