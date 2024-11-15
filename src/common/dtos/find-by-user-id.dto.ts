import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindByUserIdDto {
  @ApiProperty()
  @IsString()
  userId: string;
}
