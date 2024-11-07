import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../../user/models/user.schema';
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
    const user: UserDocument = await this.userService.getUser(username);
    if (!(await user?.validatePassword(password))) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, userId: user._id };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
