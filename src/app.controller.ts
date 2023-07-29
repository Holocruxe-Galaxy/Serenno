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

  @Post('/notification')
  notification(@Body() data) {
    console.log(data);
    return 'Ok';
  }

  @Post('/order')
  async createOrder(@Body() data) {
    const createdOrder = this.appService.createOrder(data);

    this.httpService
      .get('https://api.mercadolibre.com/items/MLA1380266233', {
        headers: {
          Authorization: `Bearer APP_USR-8119640945694263-070700-dbeea63075ad777f5ff43ae55c233f6c-1156166910`,
        },
      })
      .subscribe((value) => {
        console.log(value);
      });

    return createdOrder;
  }
}
