import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationDto } from 'src/notification/dto/notification.dto';
import { ShipmentsService } from './shipments.service';
import { Token } from 'src/admin/schemas/token.schema';

export interface ConnectedClients {
  [id: string]: Socket;
}

@WebSocketGateway()
export class ShipmentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly shipmentsService: ShipmentsService) {}
  @WebSocketServer() server: Server;
  private readonly connectedClients: ConnectedClients = {};

  handleConnection(client: any) {
    this.connectedClients[client.id] = client.id;
    return;
  }
  handleDisconnect(client: any) {
    delete this.connectedClients[client.id];
    return;
  }

  async eventEmitter(
    notification: NotificationDto,
    headers: Token,
  ): Promise<string> {
    const { shipment } = await this.shipmentsService.create(
      notification,
      headers,
    );

    this.server.emit('broadcast', shipment);
    return 'Hello world!';
  }
}
