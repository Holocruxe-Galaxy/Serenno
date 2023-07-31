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

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => AdminService))
    private readonly adminService: AdminService,
    @Inject(forwardRef(() => ShipmentsGateway))
    private readonly shipmentsGateway: ShipmentsGateway,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap({
        complete: async () => {
          const notification: NotificationDto = context
            .switchToHttp()
            .getRequest().body;

          console.log(`After... ${Date.now() - now}ms`);
          console.log(notification.resource);
          console.log(notification.attempts);
          console.log(context.switchToHttp().getResponse());
          await this.notificationService.create(notification);
          const headers = await this.adminService.findAll();
          await this.shipmentsGateway.eventEmitter(notification, headers);
        },
      }),
    );
  }
}
