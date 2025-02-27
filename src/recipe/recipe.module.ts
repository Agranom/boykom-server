import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { LoggerModule } from '../providers/logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { RecipeRepository } from './services/recipe.repository';
import { RecipeService } from './services/recipe.service';
import { RecipeController } from './controllers/recipe.controller';
import { RecipeGeneratorService } from './services/recipe-generator.service';
import { GcpModule } from '../providers/gcp/gcp.module';
import { SocketModule } from '../providers/socket/socket.module';
import { RecipeInstruction } from './entities/recipe-instruction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, RecipeIngredient, RecipeInstruction]),
    LoggerModule,
    AuthModule,
    GcpModule,
    SocketModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeRepository, RecipeService, RecipeGeneratorService],
})
export class RecipeModule {}
