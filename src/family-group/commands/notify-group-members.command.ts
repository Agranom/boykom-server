import { Command } from '@nestjs/cqrs';
import { User } from '../../user/entities/user.entity';

/**
 * Instructs the system to notify group members about an action performed by a user.
 */
export class NotifyGroupMembersCommand extends Command<{
  user: User;
  groupId: string;
  title: string;
  bodyFn: (firstName: string, lastName: string) => string;
}> {
  constructor(
    public readonly user: User,
    public readonly groupId: string,
    public readonly title: string,
    public readonly bodyFn: (firstName: string, lastName: string) => string,
  ) {
    super();
  }
}
