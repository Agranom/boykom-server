/**
 * Fired whenever an action related to a group member occurs.
 */
export class GroupMemberActionEvent {
  constructor(
    public readonly user: {
      id: string;
      firstName: string;
      lastName: string;
    },
    public readonly groupId: string,
    public readonly actionType: 'added' | 'removed' | 'accepted',
  ) {}
}
