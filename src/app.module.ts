import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { GroceryModule } from './grocery/grocery.module';
import { UserModule } from './user/user.module';
import { FamilyGroupModule } from './family-group/family-group.module';
import { SubscriptionModule } from './notification/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MongooseModule.forRoot(String(process.env.DB_URL)),
    ScheduleModule.forRoot(),
    GroceryModule,
    AuthModule,
    UserModule,
    FamilyGroupModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {
}
