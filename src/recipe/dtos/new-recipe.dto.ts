import { PickType } from '@nestjs/swagger';
import { Recipe } from '../entities/recipe.entity';

const keys = [
  'title',
  'description',
  'portionsCount',
  'instructions',
  'ingredients',
  'imageUrl',
  'videoUrl',
] as const;

export class NewRecipeDto extends PickType(Recipe, keys) {}
