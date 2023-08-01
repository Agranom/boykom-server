import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { FamilyGroup, FamilyGroupDocument } from '../models/family-group.schema';

@Injectable()
export class FamilyGroupService {
  constructor(@InjectModel('familyGroup') private familyGroup: Model<FamilyGroupDocument>) {
  }

  async create(createGroupDto: CreateGroupDto, ownerId: string): Promise<any> {
    return this.familyGroup.create({ ownerId, memberIds: createGroupDto.userIds });
  }

  async getByUserId(id: string): Promise<FamilyGroup | null> {
    const group: FamilyGroupDocument | null = await this.familyGroup.findOne({ $or: [{ ownerId: id }, { memberIds: { $in: id } }] });
    return group ? group.toJSON() as FamilyGroup : null;
  }

  async updateGroupByOwnerId(id: string, dto: UpdateGroupDto): Promise<FamilyGroup> {
    const updatedGroup = await this.familyGroup.findOneAndUpdate({ ownerId: id }, { memberIds: dto.userIds }, { new: true });
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
}
