import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RecipeVideoFile {
  @ApiProperty()
  @IsString()
  uri: string;

  @ApiProperty()
  @IsString()
  fileId: string;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  publicFileId?: string;
}

export class RecipeMetadataDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  hasInstructions: boolean;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  videoUrl?: string;

  @ApiProperty({ type: RecipeVideoFile })
  @IsOptional()
  @Type(() => RecipeVideoFile)
  @ValidateNested()
  videoFile?: RecipeVideoFile;
}
