import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosRequestConfig } from 'axios';

import { Token } from 'src/admin/schemas/token.schema';
import { Shipment } from './schemas/shipment.schema';
import { NotificationDto } from 'src/notification/dto/notification.dto';
import { CoreData, Seller, Shipping } from './interfaces';

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(Shipment.name) private readonly shippingModel: Model<Shipment>,
  ) {}

  async create(notification: NotificationDto, token: Token) {
    const headers: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'x-format-new': true,
      },
    };
    try {
      const shipment = await this.getDataFromApi<Shipping>(
        headers,
        notification.resource,
      );

      const seller = await this.getDataFromApi<Seller[]>(
        headers,
        `/users/${shipment.origin.sender_id}/addresses`,
      );

      const destinationData = shipment.destination.shipping_address;

      const coreData: CoreData = {
        id: shipment.id,
        seller: seller[0].contact,
        address: destinationData.address_line,
        zipCode: destinationData.zip_code,
        deliveryPreferences: destinationData.delivery_preference,
      };

      await this.shippingModel.create({ shipment, seller, coreData });

      return { coreData };
    } catch (error) {
      console.log(error);
    }
  }

  private async getDataFromApi<T>(
    headers: AxiosRequestConfig,
    params: string,
  ): Promise<T> {
    const { data } = await this.httpService.axiosRef.get<T>(
      `${this.configService.get('MERCADO')}${params}`,
      headers,
    );
    return data;
  }

  async findAll() {
    const data: CoreData[] = await this.shippingModel.find().select('coreData');
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} shipment`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipment`;
  }
}
