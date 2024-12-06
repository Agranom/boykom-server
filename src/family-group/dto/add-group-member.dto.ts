import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddGroupMemberDto {
  @ApiProperty()
  @IsString()
  username: string;
}
