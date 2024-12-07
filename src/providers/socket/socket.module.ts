import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { LoggerModule } from '../logger/logger.module';
import { SocketRoomsModule } from './socket-rooms/socket-rooms.module';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [LoggerModule, SocketRoomsModule, AuthModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketService],
})
export class SocketModule {}
