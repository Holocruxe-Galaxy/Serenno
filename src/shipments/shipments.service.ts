import { Inject, Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosRequestConfig } from 'axios';

import { Token } from 'src/admin/schemas/token.schema';
import { Shipment } from './schemas/shipment.schema';
import { NotificationDto } from 'src/notification/dto/notification.dto';
import { CoreData, Seller, Shipping } from './interfaces';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(Shipment.name) private readonly shippingModel: Model<Shipment>,
    @Inject(AdminService)
    private readonly adminService: AdminService,
  ) {}

  async create(notification: NotificationDto, token?: Token) {
    const exists = await this.checkIfExists(notification.resource);

    try {
      const headers: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'x-format-new': true,
        },
      };
      const shipment = await this.getDataFromApi<Shipping>(
        headers,
        notification.resource,
      );

      const seller = await this.getDataFromApi<Seller>(
        headers,
        `/users/${shipment.origin.sender_id}`,
      );

      const destinationData = shipment.destination.shipping_address;

      const date = new Date(shipment.lead_time.estimated_delivery_time.date);
      const deliveryTime = new Intl.DateTimeFormat('sp-Mx').format(date);

      const coreData: CoreData = {
        id: shipment.id,
        seller: seller.nickname,
        sellerAddress: seller.address.address,
        buyer: shipment.destination.receiver_name,
        address: destinationData.address_line,
        zipCode: destinationData.zip_code,
        deliveryPreferences: destinationData.delivery_preference,
        deliveryTime,
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
      if (!error.response)
        throw new HttpException(
          'Hubo un error inesperado. Por favor avise cuanto antes al desarrollador.',
          400,
        );
      if (error.response.status === 400 || error.response.status === 401) {
        const newToken = await this.adminService.exchangeRefreshForAccessToken(
          token,
        );
        this.create(notification, newToken);
      } else {
        console.log(error);
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

  private async checkIfExists(resource: string) {
    const id = Number(resource.split('/')[2]);

    return await this.shippingModel.findOne({ 'coreData.id': id });
  }

  async assignDates() {
    const shipments = await this.findAll();

    for (const shipment of shipments) {
      if (shipment.shipment.lead_time.estimated_delivery_time.date) {
        const date = new Date(
          shipment.shipment.lead_time.estimated_delivery_time.date,
        );
        const deliveryTime = new Intl.DateTimeFormat('sp-Mx').format(date);

        await shipment.updateOne({
          coreData: { ...shipment.coreData, deliveryTime },
        });
      }
    }
  }

  async findAll() {
    return await this.shippingModel
      .find()
      .select('coreData')
      .sort({ createdAt: -1 });
  }
}
