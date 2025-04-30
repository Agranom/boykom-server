import { Command } from '@nestjs/cqrs';

/**
 * Instructs the system to run the grocery‐creation notification logic
 * (socket + push) for a given user and grocery name.
 */
export class NotifyGroceryCreatedCommand extends Command<{
  userId: string;
  groceryName: string;
}> {
  constructor(public readonly userId: string, public readonly groceryName: string) {
    super();
  }
}
