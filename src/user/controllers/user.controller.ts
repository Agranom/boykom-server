import { Controller, Get, HttpCode, HttpStatus, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { IRequest } from '../../common/models/request.interface';
import { UserWithoutPasswordDto } from '../dto/user-without-password.dto';
import { UserService } from '../services/user.service';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query('excludeMe') excludeMe: boolean,
    @Req() req: IRequest,
  ): Promise<UserWithoutPasswordDto[]> {
    return this.userService.getAll(excludeMe, req.user.userId);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getUser(@Req() req: IRequest): Promise<UserWithoutPasswordDto> {
    const user = await this.userService.getUserById(req.user.userId);
    return plainToInstance(UserWithoutPasswordDto, user);
  }
}
