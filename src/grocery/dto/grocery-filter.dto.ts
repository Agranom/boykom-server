import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { TO_BOOLEAN } from '../../common/const/transform';
import { Transform } from 'class-transformer';

export class GroceryFilterDto {
  @ApiProperty()
  @IsOptional()
  @Transform(...TO_BOOLEAN)
  @IsBoolean()
  inFridge?: boolean;
}
