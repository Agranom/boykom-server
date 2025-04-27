import { Command, ICommand } from '@nestjs/cqrs';

export class NotifyGroceryChangeCommand extends Command<{ userId: string }> {
  constructor(public readonly userId: string) {
    super();
  }
}
