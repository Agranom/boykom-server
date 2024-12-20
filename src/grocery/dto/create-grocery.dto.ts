import { PickType } from '@nestjs/swagger';
import { Grocery } from '../entities/grocery.entity';

export class CreateGroceryDto extends PickType(Grocery, ['name', 'status', 'priority']) {}
