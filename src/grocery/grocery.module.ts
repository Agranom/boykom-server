import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FamilyGroupModule } from '../family-group/family-group.module';
import { SubscriptionModule } from '../notification/subscription.module';
import { UserModule } from '../user/user.module';
import { GroceryController } from "./controllers/grocery.controller";
import { GrocerySchema } from "./schemas/grocery.schema";
import { GroceryService } from "./services/grocery.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "grocery", schema: GrocerySchema }]),
    FamilyGroupModule,
    SubscriptionModule,
    UserModule,
  ],
  providers: [GroceryService],
  controllers: [GroceryController]
})
export class GroceryModule {

}
