import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyGroupModule } from '../family-group/family-group.module';
import { SubscriptionModule } from '../subsciption/subscription.module';
import { UserModule } from '../user/user.module';
import { GroceryController } from './controllers/grocery.controller';
import { GroceryEntity } from './entities/grocery.entity';
import { GrocerySchema } from './schemas/grocery.schema';
import { GroceryService } from './services/grocery.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'grocery', schema: GrocerySchema }]),
    TypeOrmModule.forFeature([GroceryEntity]),
    FamilyGroupModule,
    SubscriptionModule,
    UserModule,
  ],
  providers: [GroceryService],
  controllers: [GroceryController],
})
export class GroceryModule {}
