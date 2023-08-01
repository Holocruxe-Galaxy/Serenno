import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { NotificationDto } from 'src/notification/dto/notification.dto';
import { Shipment } from './interfaces/shipments.interface';
import { Token } from 'src/admin/schemas/token.schema';

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async create(notification: NotificationDto, token: Token) {
    const headers = {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'x-format-new': true,
      },
    };
    try {
      const { data: shipment }: { data: Shipment } =
        await this.httpService.axiosRef.get(
          `${this.configService.get('MERCADO')}${notification.resource}`,
          headers,
        );

      // const { data: item } = await this.httpService.axiosRef.get(
      //   `${this.configService.get('MERCADO')}${notification.resource}/items`,
      //   headers,
      // );

      return { shipment };
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return `This action returns all shipments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shipment`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipment`;
  }
}
