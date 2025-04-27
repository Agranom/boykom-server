import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyGroceryChangeCommand } from '../notify-grocery-change.command';
import { GroceryService } from '../../services/grocery.service';
import { AppLogger } from '../../../providers/logger/logger.service';

@CommandHandler(NotifyGroceryChangeCommand)
export class NotifyGroceryChangeHandler implements ICommandHandler<NotifyGroceryChangeCommand> {
  constructor(private readonly groceryService: GroceryService, private readonly logger: AppLogger) {
    this.logger.setContext(NotifyGroceryChangeHandler.name);
  }

  /**
   * Executes the notification logic by calling the existing method.
   */
  async execute(command: NotifyGroceryChangeCommand): Promise<{ userId: string }> {
    try {
      await this.groceryService.onGroceryChange(command.userId);

      return { userId: command.userId };
    } catch (error) {
      this.logger.error(
        `Failed to handle NotifyGroceryChangeCommand for user ${command.userId}`,
        error,
      );
      // rethrow if necessary, or swallow to avoid crashing the bus
      throw error;
    }
  }
}
