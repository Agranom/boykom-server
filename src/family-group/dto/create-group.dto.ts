import { PickType } from '@nestjs/swagger';
import { AddGroupMemberDto } from './add-group-member.dto';

export class CreateGroupDto extends PickType(AddGroupMemberDto, ['username']) {}
