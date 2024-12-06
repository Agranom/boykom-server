import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/services/auth.service';
import { AppLogger } from '../logger/logger.service';
import { eSocketEvent } from './enums/socket-event.enum';
import { SocketRoomsService } from './socket-rooms/socket-rooms.service';

@WebSocketGateway()
@Injectable()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private _clients: Map<string, Set<Socket>> = new Map();

  constructor(
    private authService: AuthService,
    private logger: AppLogger,
    private socketRoomsService: SocketRoomsService,
  ) {
    this.logger.setContext(SocketGateway.name);
  }

  get clients(): Map<string, Set<Socket>> {
    return this._clients;
  }

  async handleConnection(client: Socket) {
    this.logger.log(`"${client.id}": connected`);

    if (!(await this.authenticateClient(client))) {
      client.disconnect();

      this.logger.log(`"${client.id}": force disconnected`);

      return;
    }

    this.logger.log(`"${client.id}": authenticated`);

    const userId = client.data.user.userId;

    // Store the client with userId
    if (!this._clients.has(userId)) {
      this._clients.set(userId, new Set());
    }
    this._clients.get(userId)?.add(client);

    this.logger.log(`"${client.id}": initialized`);
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.user?.userId;

    if (this.clients.has(userId)) {
      this.clients.get(userId)?.delete(client);

      if (!this.clients.get(userId)?.size) {
        this.clients.delete(userId);
      }
    }

    this.logger.log(`"${client.id}": disconnected`);
  }

  private async authenticateClient(client: Socket): Promise<boolean> {
    try {
      const accessToken =
        client.handshake.auth['accessToken'] || // uses handshake post payload - preferred way
        client.handshake.headers['authorization']; // to be able to connect in soft like postman

      if (!accessToken || typeof accessToken !== 'string') {
        this.logger.log(`"${client.id}": cannot authenticate`);

        return false;
      }

      const userRequestPayload = await this.authService.verifyToken(accessToken);

      if (!userRequestPayload) {
        this.logger.error(`"${client.id}": Couldn't validate token - "${accessToken}"`);

        return false;
      }

      client.data.user = userRequestPayload;
    } catch (e) {
      this.logger.warn(`"${client.id}": cannot authenticate`, e.message);

      return false;
    }

    return true;
  }

  // For the future use, add to handleConnection
  private async joinToRooms(client: Socket): Promise<void> {
    const rooms = await this.socketRoomsService.getUserRooms(client.data.user.userId);

    client.join(rooms);

    this.logger.log(`"${client.id}": joined to "${rooms.length}" rooms`);
  }
}
