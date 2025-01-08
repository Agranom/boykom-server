import { PickType } from '@nestjs/swagger';
import { Recipe } from '../entities/recipe.entity';

const keys = [
  'title',
  'description',
  'cookingTime',
  'cookingMethod',
  'ingredients',
  'imageUrl',
] as const;

export class NewRecipeDto extends PickType(Recipe, keys) {}
