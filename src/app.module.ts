import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { GroceryModule } from './grocery/grocery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(String(process.env.DB_URL)),
    GroceryModule,
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
