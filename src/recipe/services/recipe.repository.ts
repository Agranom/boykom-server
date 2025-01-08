import { Injectable } from '@nestjs/common';
import { EntityRepository } from '../../common/services/entity.repository';
import { Recipe } from '../entities/recipe.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RecipeRepository extends EntityRepository<Recipe> {
  constructor(@InjectRepository(Recipe) repository: Repository<Recipe>) {
    super(repository);
  }

  async getFullRecipeById(recipeId: string): Promise<Recipe | null> {
    return this.findOne({ where: { id: recipeId }, relations: ['ingredients'] });
  }
}
