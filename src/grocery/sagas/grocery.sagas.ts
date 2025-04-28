import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroceryChangedEvent } from '../events/grocery-changed.event';
import { GroceryCreatedEvent } from '../events/grocery-created.event';
import { NotifyGroceryChangeCommand } from '../commands/notify-grocery-change.command';
import { NotifyGroceryCreatedCommand } from '../commands/notify-grocery-created.command';

@Injectable()
export class GrocerySagas {
  /**
   * When a GroceryChangedEvent is published, dispatch
   * a NotifyGroceryChangeCommand.
   */
  @Saga()
  groceryChanged = (events$: Observable<any>): Observable<NotifyGroceryChangeCommand> => {
    return events$.pipe(
      ofType(GroceryChangedEvent),
      map((event: GroceryChangedEvent) => {
        return new NotifyGroceryChangeCommand(event.userId);
      }),
    );
  };

  /**
   * When a GroceryCreatedEvent is published, dispatch
   * a NotifyGroceryCreatedCommand.
   */
  @Saga()
  groceryCreated = (events$: Observable<any>): Observable<NotifyGroceryCreatedCommand> => {
    return events$.pipe(
      ofType(GroceryCreatedEvent),
      map((event: GroceryCreatedEvent) => {
        return new NotifyGroceryCreatedCommand(event.userId, event.groceryName);
      }),
    );
  };
}
