import { PickType } from '@nestjs/swagger';
import { Grocery } from '../entities/grocery.entity';

export class UpsertGroceryDto extends PickType(Grocery, ['name', 'status', 'priority']) {}
