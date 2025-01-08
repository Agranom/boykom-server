import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { appConfig } from './config/app.config';
import { GroceryModule } from './grocery/grocery.module';
import { LoggerModule } from './providers/logger/logger.module';
import { SocketModule } from './providers/socket/socket.module';
import { SubscriptionModule } from './subsciption/subscription.module';
import { UserModule } from './user/user.module';
import { FamilyGroupModule } from './family-group/family-group.module';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return configService.getOrThrow<DataSourceOptions>('typeOrmConfig');
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    GroceryModule,
    AuthModule,
    UserModule,
    FamilyGroupModule,
    SubscriptionModule,
    SocketModule,
    LoggerModule,
    RecipeModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
