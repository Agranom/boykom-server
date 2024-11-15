import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { FindByIdDto } from '../../common/dtos/find-by-id.dto';

export class DeleteMemberParamsDto extends FindByIdDto {
  @ApiProperty()
  @IsString()
  memberId: string;
}
