import { Controller, Get, Post, Body } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
// import { LostNotificationDto } from 'src/notification/dto/notification.dto';
import { FiltersDto } from './dto/filters.dto';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}
  // @Post()
  // findMissingNotification(@Body() token: LostNotificationDto) {
  //   return this.shipmentsService.create(token, token as any);
  // }

  // @Get('dates')
  // dates() {
  //   return this.shipmentsService.assignDates();
  // }

  // @Get('delivery')
  // delivery() {
  //   return this.shipmentsService.findAllDeliveryTypes();
  // }

  // @Post('populate')
  // populate(
  //   @Body() token: Pick<LostNotificationDto, 'access_token' | 'user_id'>,
  // ) {
  //   return this.shipmentsService.populate(token as any);
  // }

  @Get('addfilters')
  addFilters() {
    return this.shipmentsService.populateFilters();
  }

  @Get('filters')
  filters() {
    return this.shipmentsService.findFilters();
  }

  @Post()
  async findAll(@Body() { limit, skip, ...filter }: FiltersDto) {
    const formattedFilters = this.shipmentsService.formatFilters(filter);
    const filters = await this.shipmentsService.findFilters();
    const count = await this.shipmentsService.count(formattedFilters);
    const shipments = await this.shipmentsService.filterData({
      limit,
      skip,
      ...formattedFilters,
    });

    return { shipments, filters, count };
  }
}
