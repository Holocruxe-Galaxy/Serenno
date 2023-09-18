import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { OrderRoot } from './interfaces/order.interface';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { NotificationDto } from 'src/notification/dto/notification.dto';
import { Token } from 'src/admin/schemas';
import { NotificationService } from 'src/notification/notification.service';
import { AxiosRequestConfig } from 'axios';
import { AdminService } from 'src/admin/admin.service';
import { ShipmentsService } from 'src/shipments/shipments.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => ShipmentsService))
    private readonly shipmentsService: ShipmentsService,
    @Inject(AdminService)
    private readonly adminService: AdminService,
  ) {}
  async create(notification: NotificationDto, token?: Token) {
    console.log('ohlalala');
    const exists = await this.checkIfExists(notification.resource);
    try {
      const headers: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'x-format-new': true,
        },
      };
      const order = await this.getDataFromApi<OrderRoot>(
        headers,
        notification.resource,
      );
      console.log('hla');

      if (order?.shipping?.id) {
        await this.shipmentsService.findByCoreDataIdAndAddOrder(
          order?.shipping?.id,
          order.id,
        );
      }

      if (exists) {
        return await this.orderModel.findOneAndUpdate(
          { order: { id: exists.id } },
          { order },
        );
      }

      return await this.orderModel.create({ order });
    } catch (error) {
      if (!error.response)
        throw new HttpException(
          'Hubo un error inesperado. Por favor avise cuanto antes al desarrollador.',
          400,
        );
      if (
        error.response.status === 400 ||
        error.response.status === 401 ||
        error.response.status === 403
      ) {
        const newToken = await this.adminService.exchangeRefreshForAccessToken(
          token,
        );
        this.create(notification, newToken);
      } else {
        console.log(error.response);
      }
    }
  }

  private async getDataFromApi<T>(
    headers: AxiosRequestConfig,
    params: string,
  ): Promise<T> {
    return (
      await this.httpService.axiosRef.get<T>(
        `${this.configService.get('MERCADO')}${params}`,
        headers,
      )
    ).data;
  }

  async populate(token?: Token) {
    const resources = await this.notificationService.findByTopic('orders_v2');
    const ids: number[] = [];

    for (const res of resources) {
      if (res.user_id === token.user_id) await this.create(res, token);
      else if (!ids.includes(res.user_id)) ids.push(res.user_id);
    }
    return ids;
  }

  async findOne(id: number) {
    return await this.orderModel.findOne({ 'order.shipping.id': id });
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  private async checkIfExists(resource: string) {
    const id = Number(resource.split('/')[2]);

    return await this.orderModel.findOne({ 'order.id': id });
  }
}
