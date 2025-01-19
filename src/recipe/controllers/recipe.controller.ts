import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RecipeService } from '../services/recipe.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { HttpStatusCode } from 'axios';
import { IRequest } from '../../common/models/request.interface';
import { NewRecipeDto } from '../dtos/new-recipe.dto';
import { UserRecipeDto } from '../dtos/user-recipe.dto';
import { Recipe } from '../entities/recipe.entity';
import { FindByIdDto } from '../../common/dtos/find-by-id.dto';
import { GenerateRecipeRequestDto } from '../dtos/generated-recipe.dto';

@Controller('recipes')
@ApiTags('recipes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Post('')
  @HttpCode(HttpStatusCode.Created)
  @ApiResponse({ status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  createRecipe(@Req() req: IRequest, @Body() dto: NewRecipeDto) {
    return this.recipeService.createRecipe(dto, req.user.userId);
  }

  @Get('/my')
  @ApiResponse({ type: UserRecipeDto, isArray: true, status: HttpStatus.OK })
  getUserRecipes(@Req() req: IRequest): Promise<UserRecipeDto[]> {
    return this.recipeService.getUserRecipes(req.user.userId);
  }

  @Get(':id')
  @ApiResponse({ type: Recipe })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  getRecipeById(@Param() { id }: FindByIdDto): Promise<Recipe> {
    return this.recipeService.getOneById(id);
  }

  @Put(':id')
  @ApiResponse({ type: Recipe, status: HttpStatus.OK })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  updateRecipeById(
    @Param() { id }: FindByIdDto,
    @Body() body: NewRecipeDto,
    @Req() req: IRequest,
  ): Promise<Recipe> {
    return this.recipeService.updateRecipeById(id, body, req.user.userId);
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  deleteRecipeById(@Param() { id }: FindByIdDto, @Req() req: IRequest) {
    return this.recipeService.deleteById(id, req.user.userId);
  }

  @Post('generate/instagram')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponse({ type: NewRecipeDto, status: HttpStatus.ACCEPTED })
  async generateRecipeFromInstagram(
    @Body() { postUrl }: GenerateRecipeRequestDto,
    @Req() req: IRequest,
  ): Promise<void> {
    this.recipeService.generateFromInstagram(postUrl, req.user.userId);
  }
}
