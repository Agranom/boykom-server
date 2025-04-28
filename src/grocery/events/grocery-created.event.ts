/**
 * Fired whenever a new grocery item is created.
 */
export class GroceryCreatedEvent {
  constructor(public readonly userId: string, public readonly groceryName: string) {}
}
