import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GroceryController } from "./controllers/grocery.controller";
import { GrocerySchema } from "./schemas/grocery.schema";
import { GroceryService } from "./services/grocery.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "grocery", schema: GrocerySchema }])
  ],
  providers: [GroceryService],
  controllers: [GroceryController]
})
export class GroceryModule {

}
