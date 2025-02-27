import { OmitType } from '@nestjs/swagger';
import { Recipe } from '../entities/recipe.entity';

export class UserRecipeDto extends OmitType(Recipe, ['ingredients', 'instructions', 'videoUrl']) {}
