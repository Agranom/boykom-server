import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { GroceryModule } from './grocery/grocery.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(String(process.env.DB_URL)),
    GroceryModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
