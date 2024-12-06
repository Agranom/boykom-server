import { Module } from '@nestjs/common';
import { FamilyGroupModule } from '../../../family-group/family-group.module';
import { FamilyGroupRoomsService } from './rooms/family-group-rooms.service';
import { SocketRoomsService } from './socket-rooms.service';

@Module({
  imports: [FamilyGroupModule],
  providers: [SocketRoomsService, FamilyGroupRoomsService],
  exports: [SocketRoomsService],
})
export class SocketRoomsModule {}
