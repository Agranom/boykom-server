import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyGroupModule } from '../family-group/family-group.module';
import { SubscriptionModule } from '../subsciption/subscription.module';
import { UserModule } from '../user/user.module';
import { GroceryController } from './controllers/grocery.controller';
import { Grocery } from './entities/grocery.entity';
import { GroceryRepository } from './services/grocery.repository';
import { GroceryService } from './services/grocery.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grocery]), FamilyGroupModule, SubscriptionModule, UserModule],
  providers: [GroceryService, GroceryRepository],
  controllers: [GroceryController],
})
export class GroceryModule {}
