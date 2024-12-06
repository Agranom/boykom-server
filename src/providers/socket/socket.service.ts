import { Injectable } from '@nestjs/common';
import { eSocketEvent } from './enums/socket-event.enum';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService {
  constructor(private socketGateway: SocketGateway) {}

  sendToUser(userId: string, event: eSocketEvent, payload?: any) {
    const userClients = this.socketGateway.clients.get(userId);

    if (userClients) {
      userClients.forEach((client) => {
        client.emit(event, payload);
      });
    }
  }

  sendToUsers(userIds: string[], event: eSocketEvent, payload?: any) {
    userIds.forEach((userId) => {
      this.sendToUser(userId, event, payload);
    });
  }
}
