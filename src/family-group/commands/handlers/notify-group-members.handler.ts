import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyGroupMembersCommand } from '../notify-group-members.command';
import { FamilyGroupService } from '../../services/family-group.service';
import { AppLogger } from '../../../providers/logger/logger.service';
import { User } from '../../../user/entities/user.entity';

@CommandHandler(NotifyGroupMembersCommand)
export class NotifyGroupMembersHandler implements ICommandHandler<NotifyGroupMembersCommand> {
  constructor(
    private readonly familyGroupService: FamilyGroupService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(NotifyGroupMembersHandler.name);
  }

  /**
   * Executes the notification logic for group members by calling FamilyGroupService.
   */
  async execute(command: NotifyGroupMembersCommand): Promise<{
    user: User;
    groupId: string;
    title: string;
    bodyFn: (firstName: string, lastName: string) => string;
  }> {
    const { user, groupId, title, bodyFn } = command;

    await this.familyGroupService.notifyGroupMembers(user, groupId, { title, bodyFn });

    return { user, groupId, title, bodyFn };
  }
}
