import { eGroceryItemStatus } from '../models/grocery.model';

export class CreateGroceryDto {
  name: string;
  status: eGroceryItemStatus;
  priority: string;
}
