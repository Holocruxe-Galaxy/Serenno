import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationDto } from 'src/notification/dto/notification.dto';

export interface ConnectedClients {
  [id: string]: Socket;
}

@WebSocketGateway()
export class ShipmentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
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

  eventEmitter(notification: NotificationDto): string {
    console.log('estoy en el gateawaito');
    this.server.emit('broadcast', notification);
    return 'Hello world!';
  }
}
