import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { DataSource, Not } from 'typeorm';
import { staticText } from '../../common/const/static-text';
import { INotificationPayload } from '../../common/models/notification-payload.interface';
import { IUserRequestPayload } from '../../common/models/request.interface';
import { IStatusResponse } from '../../common/models/status-response.interface';
import { eSocketEvent } from '../../providers/socket/enums/socket-event.enum';
import { SubscriptionService } from '../../subsciption/services/subscription.service';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { AddGroupMemberDto } from '../dto/add-group-member.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { FamilyGroup } from '../entities/family-group.entity';
import { GroupMember } from '../entities/group-member.entity';
import { GroupMemberActionEvent } from '../events/group-member-action.event';
import { NotifyGroupMembersCommand } from '../commands/notify-group-members.command';
import { FamilyGroupRepository } from './family-group.repository';
import { GroupMemberRepository } from './group-member.repository';

@Injectable()
export class FamilyGroupService {
  constructor(
    private groupRepository: FamilyGroupRepository,
    private memberRepository: GroupMemberRepository,
    private subscriptionService: SubscriptionService,
    private userService: UserService,
    private dataSource: DataSource,
    private eventBus: EventBus,
    private commandBus: CommandBus,
  ) {}

  static getActiveGroupMembers(familyGroup: FamilyGroup): GroupMember[] {
    return familyGroup.members.filter((m) => m.isAccepted);
  }

  async create({ username }: CreateGroupDto, ownerId: string): Promise<IStatusResponse> {
    const { id: userMemberId } = await this.userService.getUserByUsername(username);

    if (userMemberId === ownerId) {
      return { success: false, message: staticText.familyGroup.memberIsOwner };
    }
    if (await this.memberRepository.isMemberExist([userMemberId, ownerId])) {
      return { success: false, message: staticText.familyGroup.memberAlreadyExists };
    }

    await this.dataSource.transaction(async (manager) => {
      const owner = await manager.findOne<User>(User, { where: { id: ownerId } });

      if (!owner) {
        throw new Error('Owner not found');
      }
      const newFamilyGroup = await manager.save(FamilyGroup, { owner });

      const member = await manager.findOne<User>(User, { where: { id: userMemberId } });

      if (!member) {
        throw new Error(`Member with ID ${userMemberId} not found`);
      }

      const groupMembers = [member, owner].map((user) => {
        const member = new GroupMember();

        member.group = newFamilyGroup;
        member.user = user;
        member.isOwner = owner.id === user.id;

        return member;
      });

      await manager.save(GroupMember, groupMembers);
    });

    return { success: true, message: staticText.familyGroup.groupCreated };
  }

  async getWithMembersByUserId(id: string): Promise<FamilyGroup | null> {
    const groupMember = await this.memberRepository.findOne({
      where: { userId: id },
      select: ['groupId'],
    });

    if (!groupMember) {
      return null;
    }

    return this.groupRepository.findOne({
      where: { id: groupMember.groupId },
      relations: ['members', 'members.user'],
    });
  }

  async addMember(
    groupId: string,
    { username }: AddGroupMemberDto,
    ownerId: string,
  ): Promise<GroupMember | IStatusResponse> {
    const user: User = await this.userService.getUserByUsername(username);

    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      select: ['ownerId', 'id'],
    });

    if (!group) {
      throw new NotFoundException('Group was not found');
    }

    if (group.ownerId !== ownerId) {
      throw new ForbiddenException('Only group owner allowed to add a new member');
    }

    if (await this.memberRepository.isMemberExist([user.id])) {
      return { success: false, message: staticText.familyGroup.memberAlreadyExists };
    }

    // TODO handle QueryFailedError

    return this.memberRepository.createOne({ user, group });
  }

  async removeMember(groupId: string, memberId: string): Promise<{ memberId: string }> {
    const member = await this.memberRepository.findOne({
      where: { id: memberId, groupId },
      relations: ['user'],
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }

    const deleteResult = await this.memberRepository.deleteById(member.id);

    if (!deleteResult.affected) {
      throw new InternalServerErrorException(`Couldn't delete member`);
    }

    this.eventBus.publish(
      new GroupMemberActionEvent(
        {
          id: member.user.id,
          firstName: member.user.firstName,
          lastName: member.user.lastName,
        },
        groupId,
        'removed',
      ),
    );

    return { memberId };
  }

  async deleteGroupById(id: string): Promise<{ id: string }> {
    const deleteResult = await this.groupRepository.deleteById(id);

    if (!deleteResult.affected) {
      throw new NotFoundException('Group was not found');
    }

    return { id };
  }

  async acceptMembership(groupId: string, user: IUserRequestPayload): Promise<void> {
    const currentMember = await this.memberRepository.findOne({
      where: { groupId, userId: user.userId },
      relations: ['user'],
    });

    if (!currentMember) {
      throw new NotFoundException(`Member not found`);
    }

    if (currentMember.isAccepted) {
      return;
    }

    currentMember.isAccepted = true;

    await this.memberRepository.createOne(currentMember);

    this.eventBus.publish(
      new GroupMemberActionEvent(
        {
          id: currentMember.user.id,
          firstName: currentMember.user.firstName,
          lastName: currentMember.user.lastName,
        },
        groupId,
        'accepted',
      ),
    );
  }

  async getGroupIdByUser(userId: string): Promise<string | undefined> {
    const groupMember = await this.memberRepository.findOne({
      where: { userId, isAccepted: true },
      select: ['groupId'],
    });

    return groupMember?.groupId;
  }

  /**
   * Returns a member and it's siblings
   * @param userId
   */
  async getMemberWithSiblingsByUserId(userId: string): Promise<{
    primaryMember: GroupMember;
    siblings: GroupMember[];
  } | null> {
    const familyGroup = await this.getWithMembersByUserId(userId);

    if (familyGroup) {
      const activeMember = familyGroup.members.find((m) => m.user.id === userId && m.isAccepted);

      if (activeMember) {
        const allMembers = FamilyGroupService.getActiveGroupMembers(familyGroup);

        return {
          primaryMember: activeMember,
          siblings: allMembers.filter((m) => m.user.id !== userId),
        };
      }
    }

    return null;
  }

  /**
   * Notifies all active members of a group except the user who performed the action
   */
  async notifyGroupMembers(
    user: User,
    groupId: string,
    { title, bodyFn }: { title: string; bodyFn: (f: string, l: string) => string },
  ): Promise<void> {
    const { firstName, lastName } = user;
    const groupMembers = await this.memberRepository.find({
      where: { groupId, userId: Not(user.id), isAccepted: true },
      select: ['userId'],
    });
    const notifierIds = groupMembers.map((m) => m.userId);

    this.subscriptionService.notifySubscribers(notifierIds, {
      title,
      body: bodyFn(firstName, lastName),
    });
  }
}
