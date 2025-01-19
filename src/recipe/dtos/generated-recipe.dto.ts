import { NewRecipeDto } from './new-recipe.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class GeneratedRecipeIngredient {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(50)
  amount: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  measurementUnit?: string;
}

export class GeneratedRecipeDto extends OmitType(NewRecipeDto, ['ingredients']) {
  @ArrayNotEmpty()
  @Type(() => GeneratedRecipeIngredient)
  @ValidateNested({ each: true })
  ingredients: GeneratedRecipeIngredient[];
}

export class GenerateRecipeRequestDto {
  @ApiProperty()
  @IsString()
  @Matches(/^https:\/\/(www\.)?instagram\.com/)
  postUrl: string;
}
