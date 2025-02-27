import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipeRepository } from './recipe.repository';
import { Recipe } from '../entities/recipe.entity';
import { UserRecipeDto } from '../dtos/user-recipe.dto';
import { NewRecipeDto } from '../dtos/new-recipe.dto';
import { DataSource, EntityManager } from 'typeorm';
import { RecipeIngredient } from '../entities/recipe-ingredient.entity';
import { AppLogger } from '../../providers/logger/logger.service';
import { RecipeGeneratorService } from './recipe-generator.service';
import { plainToInstance } from 'class-transformer';
import { SocketService } from '../../providers/socket/socket.service';
import { eSocketEvent } from '../../providers/socket/enums/socket-event.enum';
import { RecipeInstruction } from '../entities/recipe-instruction.entity';
import { RecipeMetadataDto } from '../dtos/recipe-metadata.dto';
import { AbortRecipeDto } from '../dtos/abort-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(
    private recipeRepository: RecipeRepository,
    private dataSource: DataSource,
    private logger: AppLogger,
    private recipeGeneratorService: RecipeGeneratorService,
    private socketService: SocketService,
  ) {
    this.logger.setContext(RecipeService.name);
  }

  async createRecipe(newRecipe: NewRecipeDto, userId: string): Promise<void> {
    await this.dataSource.transaction(async (entityManager: EntityManager) => {
      const { ingredients, instructions, ...recipe } = newRecipe;

      const createdRecipe = await entityManager.save(Recipe, { ...recipe, authorId: userId });

      const ingredientsWithRecipe = ingredients.map((i) => ({ ...i, recipeId: createdRecipe.id }));
      await entityManager.save(RecipeIngredient, ingredientsWithRecipe);

      const instructionsWithRecipe = instructions.map((i) => ({
        ...i,
        recipeId: createdRecipe.id,
      }));
      await entityManager.save(RecipeInstruction, instructionsWithRecipe);

      this.logger.log(`Recipe has been created.`);
    });
  }

  // async generateFromInstagram(postUrl: string, userId: string): Promise<void> {
  //   try {
  //     const generatedRecipe = await this.recipeGeneratorService.generateFromInstagram(postUrl);
  //
  //     this.logger.log(`Recipe has been generated`);
  //     const concatIngredients = generatedRecipe.ingredients.map((i) => ({
  //       ...i,
  //       amount: `${i.amount} ${i.measurementUnit}`,
  //     }));
  //
  //     const recipe = plainToInstance(NewRecipeDto, {
  //       ...generatedRecipe,
  //       ingredients: concatIngredients,
  //     });
  //
  //     this.socketService.sendToUser(userId, eSocketEvent.RecipeGenerated, recipe);
  //   } catch (e) {
  //     this.logger.error(`Couldn't generate the recipe from instagram url: ${postUrl}`, e.message);
  //
  //     this.socketService.sendToUser(userId, eSocketEvent.RecipeGenerated);
  //   }
  // }

  async createFromInstagram(dto: RecipeMetadataDto, userId: string): Promise<void> {
    try {
      const generatedRecipe = await this.recipeGeneratorService.generateFromInstagram(dto);

      this.logger.log(`Recipe has been generated`);
      const concatIngredients = generatedRecipe.ingredients.map((i) => ({
        ...i,
        amount: i.measurementUnit ? `${i.amount} ${i.measurementUnit}` : i.amount,
      }));

      const recipe = plainToInstance(NewRecipeDto, {
        ...generatedRecipe,
        ingredients: concatIngredients,
      });

      await this.createRecipe(recipe, userId);

      this.socketService.sendToUser(userId, eSocketEvent.RecipeGenerated, { success: true });
    } catch (e) {
      this.logger.error(`Couldn't generate the recipe from instagram: `, e.message);

      this.socketService.sendToUser(userId, eSocketEvent.RecipeGenerated, { success: false });
    }
  }

  async previewRecipeFromSocial(postUrl: string, userId: string) {
    try {
      const result = await this.recipeGeneratorService.getInstagramPostMetadata(postUrl);

      this.socketService.sendToUser(userId, eSocketEvent.RecipePreviewed, {
        success: true,
        data: plainToInstance(RecipeMetadataDto, result),
      });
    } catch (e) {
      this.logger.error(`Preview recipe failed: ${e.message}`);

      this.socketService.sendToUser(userId, eSocketEvent.RecipePreviewed, { success: false });
    }
  }

  async abortRecipeFromSocial(dto: AbortRecipeDto) {
    return this.recipeGeneratorService.deleteRecipeVideo(dto);
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
}
