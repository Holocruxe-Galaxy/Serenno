import {
  CallHandler,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { NotificationDto } from './dto/notification.dto';
import { ShipmentsGateway } from 'src/shipments/shipments.gateway';
import { NotificationService } from './notification.service';
import { AdminService } from 'src/admin/admin.service';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => AdminService))
    private readonly adminService: AdminService,
    @Inject(forwardRef(() => ShipmentsGateway))
    private readonly shipmentsGateway: ShipmentsGateway,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        complete: async () => {
          const notification: NotificationDto = context
            .switchToHttp()
            .getRequest().body;
          await this.notificationService.create(notification);

          const isShipment = notification.resource.split('/')[1];

          if (isShipment !== 'shipments' && isShipment !== 'orders') return;

          const headers = await this.adminService.findToken(
            notification.user_id,
          );

          if (isShipment === 'shipments')
            await this.shipmentsGateway.eventEmitter(notification, headers);
          if (isShipment === 'orders')
            await this.ordersService.create(notification, headers);
        },
      }),
    );
  }
}
