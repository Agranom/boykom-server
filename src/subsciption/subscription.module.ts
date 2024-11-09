import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionController } from './controllers/subscription.controller';
import { SubscriptionEntity } from './entities/subscription.entity';
import { UserSubscriptionsSchema } from './models/subscription.model';
import { SubscriptionService } from './services/subscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'subscription', schema: UserSubscriptionsSchema }]),
    TypeOrmModule.forFeature([SubscriptionEntity]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
