import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { staticText } from '../../common/const/static-text';
import { INotificationPayload } from '../../common/models/notification-payload.interface';
import { IStatusResponse } from '../../common/models/status-response.interface';
import { PushNotificationService } from '../../providers/push-notification/push-notification.service';
import { UpsertSubscriptionDto } from '../dto/upsert-subscription.dto';
import { SubscriptionRepository } from './subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    private repository: SubscriptionRepository,
    private pushNotificationService: PushNotificationService,
  ) {}

  async createOrUpdate(
    userId: string,
    dto: UpsertSubscriptionDto,
    userAgent: string,
  ): Promise<IStatusResponse> {
    const isExist = await this.repository.exists({ where: { userId, userAgent } });

    if (isExist) {
      return { success: false, message: staticText.subscription.create.userAlreadySubscribed };
    }

    await this.repository.upsertOne(
      {
        userId,
        userAgent,
        keys: dto.keys,
        endpoint: dto.endpoint,
      },
      ['userId'],
    );

    return { success: true, message: staticText.subscription.create.success };
  }

  async notifySubscribers(userIds: string[], payload: INotificationPayload): Promise<void> {
    const subscriptions = await this.repository.find({ where: { userId: In(userIds) } });
    const parallelSubscriptionCalls = subscriptions.map(({ endpoint, keys }) => {
      return this.pushNotificationService.send({ endpoint, keys }, payload);
    });

    await Promise.allSettled(parallelSubscriptionCalls);
  }
}
