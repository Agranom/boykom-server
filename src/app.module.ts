import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { appConfig } from './config/app.config';
import { PgConfig } from './config/pg.config';
import { GroceryModule } from './grocery/grocery.module';
import { UserModule } from './user/user.module';
import { FamilyGroupModule } from './family-group/family-group.module';
import { SubscriptionModule } from './notification/subscription.module';

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
        const { host, port, dbName, user, password } =
          configService.getOrThrow<PgConfig>('pgConfig');
        return {
          type: 'postgres',
          host,
          port,
          username: user,
          password,
          database: dbName,
        };
      },
      inject: [ConfigService],
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
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
