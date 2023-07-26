import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: String(process.env.JWT_SECRET)
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
