import { HttpException, Inject, Injectable, forwardRef } from '@nestjs/common';
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
import { OrdersService } from 'src/orders/orders.service';
import { NotificationService } from 'src/notification/notification.service';
import { Filters } from './schemas/filters.schema';
import { FilterQuery } from 'mongoose';

interface Pagination {
  limit: number;
  skip: number;
}

interface Filter {
  deliveryType?: string;
  sellerAddress?: string;
  seller?: string;
  deliveryTime?: string;
  status?: string;
}

type FormattedFilter = {
  [`core.deliveryType`]?: string;
  [`core.sellerAddress`]?: string;
  [`core.seller`]?: string;
  [`core.deliveryTime`]?: string;
  [`core.status`]?: string;
};

interface Query {
  $regex: string | number;
  $options: string;
}

interface Search {
  ['coreData.id']?: Query;
  ['coreData.address']?: Query;
  ['coreData.deliveryPreferences']?: Query;
  ['coreData.order']?: Query;
  ['coreData.zipCode']?: Query;
  ['coreData.seller']?: Query;
  ['coreData.sellerAddress']?: Query;
}

interface Or {
  $or: Search[];
}

interface And {
  $and: Or[];
}

@Injectable()
export class ShipmentsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(Shipment.name) private readonly shippingModel: Model<Shipment>,
    @InjectModel(Filters.name) private readonly filterModel: Model<Filters>,
    @Inject(AdminService)
    private readonly adminService: AdminService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    @Inject(OrdersService)
    private readonly orderService: OrdersService,
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
      const order = await this.orderService.findOne(shipment.id);
      const date = new Date(shipment.lead_time.estimated_delivery_time.date);
      const deliveryTime = new Intl.DateTimeFormat('en-GB').format(date);

      const coreData: CoreData = {
        id: shipment.id,
        seller: seller.nickname,
        sellerAddress: seller.address.address,
        buyer: shipment.destination.receiver_name,
        address: destinationData.address_line,
        zipCode: destinationData.zip_code,
        deliveryPreferences: destinationData.delivery_preference,
        deliveryTime,
        originLatitude: shipment.origin.shipping_address.latitude,
        originLongitude: shipment.origin.shipping_address.longitude,
        destinationLatitude: destinationData.latitude,
        destinationLongitude: destinationData.longitude,
        deliveryType: shipment.lead_time.shipping_method.type,
        status: shipment.status,
        order: order?.order?.id || 'Sin código disponible',
      };
      await this.addFilters(coreData);

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
      console.log(error);
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

  // It's necessary to comment the line .select('coreData') from this.findAll
  async assignDates() {
    const shipments = await this.findAll();

    for (const shipment of shipments) {
      const order = await this.orderService.findOne(shipment.shipment.id);
      await shipment.updateOne({
        coreData: {
          ...shipment.coreData,
          order: order?.order?.id || 'Sin código disponible',
        },
      });
    }
  }

  async findAllDeliveryTypes() {
    const shipments = await this.findAll();
    const delivery: string[] = [];

    for (const shipment of shipments) {
      if (shipment?.shipment?.lead_time) {
        if (
          !delivery.includes(shipment.shipment.lead_time.shipping_method.type)
        )
          delivery.push(shipment.shipment.lead_time.shipping_method.type);
      }
    }
  }

  private diacriticSensitiveRegex = (str: string): string => {
    return str
      .replace(/a|á|à/gi, '[a,á,à,A,Á,À]')
      .replace(/b|v/gi, '[b,B,v,V]')
      .replace(/c|k|s|z/gi, '[c,C,k,K,s,S,z,Z]')
      .replace(/e|é|è/gi, '[e,é,è,E,É,È]')
      .replace(/g|h|j/gi, '[g,G,h,H,j,J]')
      .replace(/i|í|ì/gi, '[i,í,ì,I,Í,Ì]')
      .replace(/n|ñ/gi, '[n,N,ñ,Ñ]')
      .replace(/o|ó|ò/gi, '[o,ó,ò,O,Ó,Ò]')
      .replace(/u|ú|ü|ù/gi, '[u,ú,ü,ù,U,Ú,Ü,Ù]');
  };

  async findByCoreDataIdAndAddOrder(id: number, order: number) {
    const shipment = await this.shippingModel.findOne({ 'coreData.id': id });

    if (shipment)
      await shipment.updateOne({ $set: { 'coreData.order': order } });
  }

  formatFilters(filters: Filter): FormattedFilter {
    const formattedFilters = {};

    for (const category in filters) {
      formattedFilters[`coreData.${category}`] = {
        $in: [filters[category]],
      };
    }

    if (!formattedFilters['coreData.deliveryType']) {
      formattedFilters['coreData.deliveryType'] = {
        $in: ['same_day', 'next_day'],
      };
    }

    return formattedFilters;
  }

  formatSearch(str: string): And {
    const search = this.diacriticSensitiveRegex(str).trim().replace(' ', '|');
    const query: Query = { $regex: search, $options: 'i' };

    return {
      $and: [
        {
          $or: [
            { ['coreData.id']: query },
            { ['coreData.address']: query },
            { ['coreData.deliveryPreferences']: query },
            { ['coreData.order']: query },
            { ['coreData.zipCode']: query },
            { ['coreData.seller']: query },
            { ['coreData.sellerAddress']: query },
          ],
        },
      ],
    };
  }

  async filterData(
    { limit, skip, ...filters }: FormattedFilter & Pagination,
    search?: And,
  ) {
    return await this.shippingModel
      .find({ ...filters, ...search })
      .limit(limit)
      .skip(skip)
      .select('coreData')
      .sort({ createdAt: -1 })
      .exec();
  }

  async count({ ...filters }: FormattedFilter) {
    return await this.shippingModel.count(filters).exec();
  }

  async findAll() {
    return await this.shippingModel
      .find({ 'coreData.deliveryType': { $in: ['same_day', 'next_day'] } })
      .select('coreData')
      .sort({ createdAt: -1 });
  }

  async findFilters() {
    return await this.filterModel.findOne().select('-_id -__v').exec();
  }

  private async addFilters(coreData: CoreData) {
    const f = await this.filterModel.findOne();

    if (!f.deliveryType.includes(coreData.deliveryType))
      f.deliveryType.push(coreData.deliveryType);
    if (!f.sellerAddress.includes(coreData.sellerAddress))
      f.sellerAddress.push(coreData.sellerAddress);
    if (!f.seller.includes(coreData.seller)) f.seller.push(coreData.seller);
    if (!f.deliveryTime.includes(coreData.deliveryTime))
      f.deliveryTime.push(coreData.deliveryTime);
    if (!f.status.includes(coreData.status)) f.status.push(coreData.status);

    await f.updateOne(f);
  }

  async populateFilters() {
    const data = await this.findAll();
    const f = await this.filterModel.findOne();

    data.forEach(({ coreData }) => {
      if (!f.deliveryType.includes(coreData.deliveryType))
        f.deliveryType.push(coreData.deliveryType);
      if (!f.deliveryPreferences.includes(coreData.deliveryPreferences))
        f.deliveryPreferences.push(coreData.deliveryPreferences);
      if (!f.sellerAddress.includes(coreData.sellerAddress))
        f.sellerAddress.push(coreData.sellerAddress);
      if (!f.seller.includes(coreData.seller)) f.seller.push(coreData.seller);
      if (!f.deliveryTime.includes(coreData.deliveryTime))
        f.deliveryTime.push(coreData.deliveryTime);
      if (!f.status.includes(coreData.status)) f.status.push(coreData.status);
    });

    await f.updateOne(f);
  }

  async populate(token?: Token) {
    const resources = await this.notificationService.findByTopic('shipments');
    const ids: number[] = [];
    for (const res of resources) {
      if (res.user_id === token.user_id) await this.create(res, token);
      else if (!ids.includes(res.user_id)) ids.push(res.user_id);
    }
    return ids;
  }
}
