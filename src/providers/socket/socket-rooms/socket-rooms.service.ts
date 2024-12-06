import { Injectable } from '@nestjs/common';
import { FamilyGroupRoomsService } from './rooms/family-group-rooms.service';

@Injectable()
export class SocketRoomsService {
  constructor(private familyGroupRoomsService: FamilyGroupRoomsService) {}
  async getUserRooms(userId: string): Promise<string[]> {
    let rooms: string[] = [];

    if (!userId) {
      return rooms;
    }

    const fgRooms = await this.familyGroupRoomsService.getRoomsByUserId(userId);

    rooms = [...rooms, ...fgRooms];

    return rooms;
  }
}
