/**
 * Fired whenever a grocery item is created, updated, or deleted.
 */
export class GroceryChangedEvent {
  constructor(public readonly userId: string) {}
}
