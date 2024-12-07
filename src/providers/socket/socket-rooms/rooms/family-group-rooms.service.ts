import { Injectable } from '@nestjs/common';
import { FamilyGroupService } from '../../../../family-group/services/family-group.service';

@Injectable()
export class FamilyGroupRoomsService {
  constructor(private familyGroupService: FamilyGroupService) {}

  async getRoomsByUserId(userId: string): Promise<string[]> {
    const familyGroupId = await this.familyGroupService.getGroupIdByUser(userId);

    return familyGroupId ? [familyGroupId] : [];
  }
}
