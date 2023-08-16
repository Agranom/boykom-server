import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { staticText } from '../../common/const/static-text';
import { IUserRequestPayload } from '../../common/models/request.interface';
import { IStatusResponse } from '../../common/models/status-response.interface';
import { SubscriptionService } from '../../notification/services/subscription.service';
import { UserService } from '../../user/services/user.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { FamilyGroup, FamilyGroupDocument } from '../models/family-group.schema';

@Injectable()
export class FamilyGroupService {
  constructor(@InjectModel('familyGroup') private familyGroup: Model<FamilyGroupDocument>,
              private subscriptionService: SubscriptionService,
              private userService: UserService) {
  }

  async create({ userIds }: CreateGroupDto, ownerId: string): Promise<IStatusResponse> {
    if (await this.isMemberExistInGroups(userIds)) {
      return { success: false, message: staticText.familyGroup.memberAlreadyExists };
    }
    await this.familyGroup.create({ ownerId, members: userIds.map(id => ({ userId: id })) });
    return { success: true, message: staticText.familyGroup.groupCreated };
  }

  async getByUserId(id: string): Promise<FamilyGroup | null> {
    const group: FamilyGroupDocument | null = await this.familyGroup.findOne({ $or: [{ ownerId: id }, { 'members.userId': id }] });
    return group ? group.toJSON() as FamilyGroup : null;
  }

  async addMembers(groupId: string, { userIds }: UpdateGroupDto): Promise<FamilyGroup | IStatusResponse> {
    if (await this.isMemberExistInGroups(userIds)) {
      return { success: false, message: staticText.familyGroup.memberAlreadyExists };
    }
    const newMembers = userIds.map(id => ({ userId: id }));
    const updatedGroup = await this.familyGroup.findByIdAndUpdate(groupId, { $addToSet: { members: newMembers } }, { new: true });
    if (!updatedGroup) {
      throw new NotFoundException('Group was not found');
    }
    return updatedGroup;
  }

  async removeMember(groupId: string, memberId: string): Promise<{ memberId: string }> {
    const group: FamilyGroupDocument | null = await this.familyGroup.findOneAndUpdate({ $and: [{ _id: groupId }, { 'members.userId': memberId }] }, { $pull: { members: { userId: memberId } } }, { new: true });
    if (!group) {
      throw new NotFoundException('Group was not found');
    }
    const { firstName, lastName } = await  this.userService.getUser(null, memberId);
    const groupMembers = group.members.filter(m => m.isAccepted && m.userId !== memberId)
    const notifierIds = [...groupMembers.map(m => m.userId), group.ownerId]
    this.subscriptionService.notifySubscribers(notifierIds, {
      title: staticText.familyGroup.removeMember.title,
      body: staticText.familyGroup.removeMember.body(firstName, lastName),
    })
    return { memberId };
  }

  async deleteGroupById(id: string): Promise<{ id: string }> {
    const deletedGroup = await this.familyGroup.findByIdAndRemove(id);
    if (!deletedGroup) {
      throw new NotFoundException('Group was not found');
    }
    return { id };
  }

  async acceptMembership(groupId: string, user: IUserRequestPayload): Promise<FamilyGroup> {
    const group: FamilyGroupDocument | null = await this.familyGroup.findOneAndUpdate({ $and: [{ _id: groupId }, { 'members.userId': user.userId }] }, { $set: { 'members.$.isAccepted': true } }, { new: true });
    if (!group) {
      throw new NotFoundException('Group was not found');
    }
    const { firstName, lastName } = await  this.userService.getUser(user.username);
    const groupMembers = group.members.filter(m => m.isAccepted && m.userId !== user.userId)
    const notifierIds = [...groupMembers.map(m => m.userId), group.ownerId]
    this.subscriptionService.notifySubscribers(notifierIds, {
      title: staticText.familyGroup.acceptMembershipPayload.title,
      body: staticText.familyGroup.acceptMembershipPayload.body(firstName, lastName),
    })
    return group.toJSON();
  }

  private async isMemberExistInGroups(memberIds: string[]): Promise<boolean> {
    const isMemberExistInGroups = await this.familyGroup.exists({ $or: [{ 'members.userId': { $in: memberIds } }, { ownerId: { $in: memberIds } }] });
    return !!isMemberExistInGroups;
  }
}
