import { Controller, Get, HttpCode, HttpStatus, Query, Req } from '@nestjs/common';
import { IRequest } from '../../common/models/request.interface';
import { User } from '../models/user.schema';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(@Query('excludeMe') excludeMe: boolean, @Req() req: IRequest): Promise<User[]> {
    return this.userService.getAll(excludeMe, req.user.userId);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getUser(@Req() req: IRequest): Promise<User> {
    const user = await this.userService.getUser(req.user.username);
    return user.toJSON();
  }
}
