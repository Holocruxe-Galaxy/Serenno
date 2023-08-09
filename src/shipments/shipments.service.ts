import { HttpException, Injectable } from '@nestjs/common';
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
    const exists = await this.checkIfExists(notification.resource);

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
        buyer: shipment.destination.receiver_name,
        address: destinationData.address_line,
        zipCode: destinationData.zip_code,
        deliveryPreferences: destinationData.delivery_preference,
      };

      if (exists) {
        await this.shippingModel.findByIdAndUpdate(exists.id, {
          shipment,
          seller,
          coreData,
        });

        return { coreData };
      }
      await this.shippingModel.create({ shipment, seller, coreData });

      return { coreData };
    } catch (error) {
      throw new HttpException(error.message, error.status);
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

  private async checkIfExists(resource: string) {
    const id = Number(resource.split('/')[2]);

    return await this.shippingModel.findOne({ 'coreData.id': id });
  }

  async findAll() {
    return await this.shippingModel.find().select('coreData');
  }
}
