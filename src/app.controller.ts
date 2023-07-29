import { Body, Controller, Get, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/notification')
  notificationGet(@Body() data) {
    console.log('entré 2222');
    console.log(data);
    return 'Ok';
  }

  @Post('/notification')
  notification(@Body() data) {
    console.log('entré');
    console.log(data);
    return 'Ok';
  }

  @Post('/order')
  async createOrder(@Body() data) {
    const createdOrder = this.appService.createOrder(data);
    return createdOrder;
  }
}
