import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindByIdDto {
  @ApiProperty()
  @IsString()
  id: string;
}
