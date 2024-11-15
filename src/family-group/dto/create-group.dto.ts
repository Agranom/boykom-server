import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  userIds: string[];
}
