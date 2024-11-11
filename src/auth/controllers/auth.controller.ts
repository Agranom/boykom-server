import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/public.decorator';
import { SignInResponseDto } from '../dto/sign-in-response.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() newUser: SignUpDto) {
    return this.authService.signUp({ ...newUser, username: newUser.username.toLowerCase() });
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: SignInResponseDto })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn({ ...signInDto, username: signInDto.username.toLowerCase() });
  }
}
