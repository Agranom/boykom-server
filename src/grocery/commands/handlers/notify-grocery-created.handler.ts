import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotifyGroceryCreatedCommand } from '../notify-grocery-created.command';
import { GroceryService } from '../../services/grocery.service';
import { AppLogger } from '../../../providers/logger/logger.service';

@CommandHandler(NotifyGroceryCreatedCommand)
export class NotifyGroceryCreatedHandler implements ICommandHandler<NotifyGroceryCreatedCommand> {
  constructor(private readonly groceryService: GroceryService, private readonly logger: AppLogger) {
    this.logger.setContext(NotifyGroceryCreatedHandler.name);
  }

  /**
   * Executes the notification logic by calling the existing method.
   */
  async execute(
    command: NotifyGroceryCreatedCommand,
  ): Promise<{ userId: string; groceryName: string }> {
    await this.groceryService.notifyOnCreate(command.userId, command.groceryName);

    return { userId: command.userId, groceryName: command.groceryName };
  }
}
