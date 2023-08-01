import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { IRequest } from '../../common/models/request.interface';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { FamilyGroup } from '../models/family-group.schema';
import { FamilyGroupService } from '../services/family-group.service';

@Controller('family-groups')
export class FamilyGroupController {
  constructor(private familyGroupService: FamilyGroupService) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createGroup(@Body() createGroupDto: CreateGroupDto, @Req() req: IRequest, @Res() res: Response): Promise<void> {
    await this.familyGroupService.create(createGroupDto, req.user.userId);
    res.json({});
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getByOwnerId(@Param('userId') userId: string): Promise<FamilyGroup | null> {
    return this.familyGroupService.getByUserId(userId);
  }

  @Put(':ownerId')
  @HttpCode(HttpStatus.OK)
  async updateGroupByOwnerId(@Body() updateGroupDto: UpdateGroupDto, @Param('ownerId') ownerId: string): Promise<FamilyGroup> {
    return this.familyGroupService.updateGroupByOwnerId(ownerId, updateGroupDto);
  }
}
