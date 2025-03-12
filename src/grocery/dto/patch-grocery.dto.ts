import { PickType } from '@nestjs/swagger';
import { Grocery } from '../entities/grocery.entity';

export class PatchGroceryDto extends PickType(Grocery, [
  'status',
  'priority',
  'version',
  'inFridge',
]) {}
