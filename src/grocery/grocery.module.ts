import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyGroupModule } from '../family-group/family-group.module';
import { LoggerModule } from '../providers/logger/logger.module';
import { SocketModule } from '../providers/socket/socket.module';
import { SubscriptionModule } from '../subsciption/subscription.module';
import { UserModule } from '../user/user.module';
import { GroceryController } from './controllers/grocery.controller';
import { Grocery } from './entities/grocery.entity';
import { GroceryStorageService } from './services/grocery-storage.service';
import { GroceryCategoriesService } from './services/grocery-categories.service';
import { GroceryRepository } from './services/grocery.repository';
import { GroceryService } from './services/grocery.service';
import { GcpModule } from '../providers/gcp/gcp.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Grocery]),
    FamilyGroupModule,
    SubscriptionModule,
    UserModule,
    SocketModule,
    LoggerModule,
    GcpModule,
  ],
  providers: [GroceryService, GroceryRepository, GroceryCategoriesService, GroceryStorageService],
  controllers: [GroceryController],
})
export class GroceryModule {}
