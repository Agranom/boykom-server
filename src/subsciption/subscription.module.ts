import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushNotificationModule } from '../providers/push-notification/push-notification.module';
import { SubscriptionController } from './controllers/subscription.controller';
import { SubscriptionEntity } from './entities/subscription.entity';
import { SubscriptionRepository } from './services/subscription.repository';
import { SubscriptionService } from './services/subscription.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity]), PushNotificationModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
