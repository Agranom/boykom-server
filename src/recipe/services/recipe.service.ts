import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipeRepository } from './recipe.repository';
import { Recipe } from '../entities/recipe.entity';
import { UserRecipeDto } from '../dtos/user-recipe.dto';
import { NewRecipeDto } from '../dtos/new-recipe.dto';
import { DataSource, EntityManager } from 'typeorm';
import { RecipeIngredient } from '../entities/recipe-ingredient.entity';
import { AppLogger } from '../../providers/logger/logger.service';

@Injectable()
export class RecipeService {
  constructor(
    private recipeRepository: RecipeRepository,
    private dataSource: DataSource,
    private logger: AppLogger,
  ) {
    this.logger.setContext(RecipeService.name);
  }

  async createRecipe(newRecipe: NewRecipeDto, userId: string): Promise<void> {
    await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const { ingredients, ...recipe } = newRecipe;

      const createdRecipe = await entityManager.save(Recipe, { ...recipe, authorId: userId });

      const ingredientsWithRecipe = ingredients.map((i) => ({ ...i, recipeId: createdRecipe.id }));
      const createdIngredients = await entityManager.save(RecipeIngredient, ingredientsWithRecipe);

      this.logger.log(`Recipe with ${createdIngredients.length} has been created.`);
    });
  }

  async getUserRecipes(userId: string): Promise<UserRecipeDto[]> {
    return this.recipeRepository.find({ where: { authorId: userId } });
  }

  async getOneById(id: string): Promise<Recipe> {
    const result = await this.recipeRepository.getFullRecipeById(id);

    if (!result) {
      throw new NotFoundException(`Recipe with ID - ${id} not found`);
    }

    return result;
  }

  async updateRecipeById(id: string, newRecipe: NewRecipeDto, userId: string): Promise<Recipe> {
    const currentRecipe = await this.recipeRepository.findOne({
      where: { id, authorId: userId },
      select: { id: true },
    });

    if (!currentRecipe) {
      throw new NotFoundException(`Recipe with ID - ${id} not found`);
    }

    return this.dataSource.transaction<Recipe>(async (entityManager: EntityManager) => {
      const { ingredients, ...recipe } = newRecipe;

      const updatedRecipe = await entityManager.save(Recipe, { ...recipe, id });

      await entityManager.delete(RecipeIngredient, { recipeId: id });

      const ingredientsWithRecipe = ingredients.map((i) => ({ ...i, recipeId: updatedRecipe.id }));
      const createdIngredients = await entityManager.save(RecipeIngredient, ingredientsWithRecipe);

      return { ...updatedRecipe, ingredients: createdIngredients };
    });
  }

  async deleteById(id: string, userId: string): Promise<void> {
    await this.recipeRepository.delete({ id, authorId: userId });
  }

  // private async upsertRecipe(id?: string, newRecipe: CreateRecipeDto): Promise {
  //
  // }
}
