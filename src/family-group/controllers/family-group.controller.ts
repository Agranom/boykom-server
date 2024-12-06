import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindByIdDto } from '../../common/dtos/find-by-id.dto';
import { IRequest } from '../../common/models/request.interface';
import { IStatusResponse } from '../../common/models/status-response.interface';
import { AddGroupMemberDto } from '../dto/add-group-member.dto';
import { CreateGroupDto } from '../dto/create-group.dto';
import { DeleteMemberParamsDto } from '../dto/delete-member-params.dto';
import { FamilyGroup } from '../entities/family-group.entity';
import { GroupMember } from '../entities/group-member.entity';
import { FamilyGroupService } from '../services/family-group.service';

@Controller('family-groups')
@ApiTags('family-groups')
@ApiBearerAuth()
export class FamilyGroupController {
  constructor(private familyGroupService: FamilyGroupService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createGroup(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: IRequest,
  ): Promise<IStatusResponse> {
    return this.familyGroupService.create(createGroupDto, req.user.userId);
  }

  @Get('/my-group')
  @HttpCode(HttpStatus.OK)
  async getByOwnerId(@Req() req: IRequest): Promise<FamilyGroup | null> {
    return this.familyGroupService.getWithMembersByUserId(req.user.userId);
  }

  @Post(':id/member')
  @HttpCode(HttpStatus.OK)
  async addMembersToGroup(
    @Body() dto: AddGroupMemberDto,
    @Param() { id }: FindByIdDto,
    @Req() req: IRequest,
  ): Promise<GroupMember | IStatusResponse> {
    return this.familyGroupService.addMember(id, dto, req.user.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteGroupById(@Param() { id }: FindByIdDto): Promise<{ id: string }> {
    return this.familyGroupService.deleteGroupById(id);
  }

  @Post(':id/accept-membership')
  @HttpCode(HttpStatus.CREATED)
  async acceptMembership(@Param() { id }: FindByIdDto, @Req() req: IRequest): Promise<void> {
    return this.familyGroupService.acceptMembership(id, req.user);
  }

  @Delete(':id/:memberId')
  @HttpCode(HttpStatus.OK)
  async removeMemberFromGroup(
    @Param() { id, memberId }: DeleteMemberParamsDto,
  ): Promise<{ memberId: string }> {
    return this.familyGroupService.removeMember(id, memberId);
  }
}
