import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { staticText } from '../../common/const/static-text';
import { IStatusResponse } from '../../common/models/status-response.interface';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { FamilyGroup, FamilyGroupDocument } from '../models/family-group.schema';

@Injectable()
export class FamilyGroupService {
  constructor(@InjectModel('familyGroup') private familyGroup: Model<FamilyGroupDocument>) {
  }

  async create({ userIds }: CreateGroupDto, ownerId: string): Promise<IStatusResponse> {
    if (await this.isMemberExistInGroups(userIds)) {
      return { success: false, message: staticText.familyGroup.memberAlreadyExists };
    }
    await this.familyGroup.create({ ownerId, members: userIds.map(id => ({ id })) });
    return { success: true, message: staticText.familyGroup.groupCreated };
  }

  async getByUserId(id: string): Promise<FamilyGroup | null> {
    const group: FamilyGroupDocument | null = await this.familyGroup.findOne({ $or: [{ ownerId: id }, { 'members.id': { $in: id } }] });
    return group ? group.toJSON() as FamilyGroup : null;
  }

  async addMembers(userId: string, { userIds }: UpdateGroupDto): Promise<FamilyGroup | IStatusResponse> {
    if (await this.isMemberExistInGroups(userIds)) {
      return { success: false, message: staticText.familyGroup.memberAlreadyExists };
    }
    const newMembers = userIds.map(id => ({ id }));
    const updatedGroup = await this.familyGroup.findOneAndUpdate({ ownerId: userId }, { $addToSet: { members: newMembers } }, { new: true });
    if (!updatedGroup) {
      throw new NotFoundException('Group was not found');
    }
    return updatedGroup;
  }

  async deleteGroupById(id: string): Promise<{ id: string }> {
    const deletedGroup = await this.familyGroup.findByIdAndRemove(id);
    if (!deletedGroup) {
      throw new NotFoundException();
    }
    return { id };
  }

  private async isMemberExistInGroups(memberIds: string[]): Promise<boolean> {
    const isMemberExistInGroups = await this.familyGroup.exists({ $or: [{ 'members.id': { $in: memberIds } }, { ownerId: { $in: memberIds } }] });
    return !!isMemberExistInGroups;
  }
}
