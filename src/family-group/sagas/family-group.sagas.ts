import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { staticText } from '../../common/const/static-text';
import { GroupMemberActionEvent } from '../events/group-member-action.event';
import { NotifyGroupMembersCommand } from '../commands/notify-group-members.command';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FamilyGroupSagas {
  /**
   * When a GroupMemberActionEvent is published, dispatch
   * a NotifyGroupMembersCommand with appropriate notification parameters.
   */
  @Saga()
  groupMemberAction = (events$: Observable<any>): Observable<NotifyGroupMembersCommand> => {
    return events$.pipe(
      ofType(GroupMemberActionEvent),
      map((event: GroupMemberActionEvent) => {
        const { user, groupId, actionType } = event;
        let title: string;
        let bodyFn: (firstName: string, lastName: string) => string;

        switch (actionType) {
          case 'removed':
            title = staticText.familyGroup.removeMember.title;
            bodyFn = staticText.familyGroup.removeMember.body;
            break;
          case 'accepted':
            title = staticText.familyGroup.acceptMembershipPayload.title;
            bodyFn = staticText.familyGroup.acceptMembershipPayload.body;
            break;
          default:
            title = '';
            bodyFn = () => '';
        }

        return new NotifyGroupMembersCommand(
          { id: user.id, firstName: user.firstName, lastName: user.lastName } as User,
          groupId,
          title,
          bodyFn,
        );
      }),
    );
  };
}
