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

@Injectable()
export class NotificationInterceptor implements NestInterceptor {
  constructor(
    @Inject(forwardRef(() => ShipmentsGateway))
    private readonly shipmentsGateway: ShipmentsGateway,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        complete: () => {
          const notification: NotificationDto = context
            .switchToHttp()
            .getRequest().body;
          console.log(
            'estoy en el contexto',
            context.switchToHttp().getRequest().body,
            'y no me arrepiento',
          );
          this.shipmentsGateway.eventEmitter(notification);
        },
      }),
    );
  }
}
