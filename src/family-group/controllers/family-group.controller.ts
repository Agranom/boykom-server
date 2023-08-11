import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req } from '@nestjs/common';
import { IStatusResponse } from '../../common/models/status-response.interface';
import { IRequest } from '../../common/models/request.interface';
import { ObjectIdPipe } from '../../common/pipes/object-id.pipe';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { FamilyGroup } from '../models/family-group.schema';
import { FamilyGroupService } from '../services/family-group.service';

@Controller('family-groups')
export class FamilyGroupController {
  constructor(private familyGroupService: FamilyGroupService) {
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req: IRequest): Promise<IStatusResponse> {
    return this.familyGroupService.create(createGroupDto, req.user.userId);
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getByOwnerId(@Param('userId') userId: string): Promise<FamilyGroup | null> {
    return this.familyGroupService.getByUserId(userId);
  }

  @Put(':ownerId')
  @HttpCode(HttpStatus.OK)
  async addMembersToGroup(@Body() updateGroupDto: UpdateGroupDto, @Param('ownerId') ownerId: string): Promise<FamilyGroup | IStatusResponse> {
    return this.familyGroupService.addMembers(ownerId, updateGroupDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteGroupById(@Param('id', ObjectIdPipe) id: string): Promise<{ id: string }> {
    return this.familyGroupService.deleteGroupById(id);
  }
}
