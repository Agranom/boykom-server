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
import { CqrsModule } from '@nestjs/cqrs';
import { NotifyGroceryChangeHandler } from './commands/handlers/notify-grocery-change.handler';
import { NotifyGroceryCreatedHandler } from './commands/handlers/notify-grocery-created.handler';
import { GrocerySagas } from './sagas/grocery.sagas';

const CommandHandlers = [NotifyGroceryChangeHandler, NotifyGroceryCreatedHandler];
const Sagas = [GrocerySagas];

@Module({
  imports: [
    TypeOrmModule.forFeature([Grocery]),
    FamilyGroupModule,
    SubscriptionModule,
    UserModule,
    SocketModule,
    LoggerModule,
    GcpModule,
    CqrsModule,
  ],
  providers: [
    ...CommandHandlers,
    ...Sagas,
    GroceryService,
    GroceryRepository,
    GroceryCategoriesService,
    GroceryStorageService,
  ],
  controllers: [GroceryController],
  exports: [GroceryService],
})
export class GroceryModule {}
