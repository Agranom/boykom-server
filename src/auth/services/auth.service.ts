import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { SignInResponseDto } from '../dto/sign-in-response.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { SignUpDto } from '../dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async signUp(newUserDto: SignUpDto): Promise<void> {
    return this.userService.createUser(newUserDto);
  }

  async signIn({ username, password }: SignInDto): Promise<SignInResponseDto> {
    const user = await this.userService.getUserByUsername(username, { includePassword: true });

    if (!(await User.isPasswordValid(password, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, userId: user.id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
