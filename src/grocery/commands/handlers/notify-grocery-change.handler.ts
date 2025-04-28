import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyGroceryChangeCommand } from '../notify-grocery-change.command';
import { GroceryService } from '../../services/grocery.service';
import { AppLogger } from '../../../providers/logger/logger.service';

/**
 * Handles the NotifyGroceryChangeCommand by executing the grocery change notification logic.
 */
@CommandHandler(NotifyGroceryChangeCommand)
export class NotifyGroceryChangeHandler implements ICommandHandler<NotifyGroceryChangeCommand> {
  constructor(private readonly groceryService: GroceryService, private readonly logger: AppLogger) {
    this.logger.setContext(NotifyGroceryChangeHandler.name);
  }

  /**
   * Executes the notification logic by calling the existing method.
   * Any unhandled exceptions will be caught by the CqrsExceptionFilter.
   */
  async execute(command: NotifyGroceryChangeCommand): Promise<{ userId: string }> {
    this.logger.log(`Executing NotifyGroceryChangeCommand for user: ${command.userId}`);

    await this.groceryService.onGroceryChange(command.userId);
    this.logger.log(`Successfully executed NotifyGroceryChangeCommand for user: ${command.userId}`);

    return { userId: command.userId };
  }
}
