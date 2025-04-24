import { PickType } from '@nestjs/swagger';
import { RecipeVideoFile } from './recipe-metadata.dto';

export class AbortRecipeDto extends PickType(RecipeVideoFile, ['publicFileId', 'fileId']) {}
