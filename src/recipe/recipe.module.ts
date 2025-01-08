import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { LoggerModule } from '../providers/logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { RecipeRepository } from './services/recipe.repository';
import { RecipeService } from './services/recipe.service';
import { RecipeController } from './controllers/recipe.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient]), LoggerModule, AuthModule],
  controllers: [RecipeController],
  providers: [RecipeRepository, RecipeService],
})
export class RecipeModule {}
