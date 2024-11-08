import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { staticText } from '../../common/const/static-text';
import { INotificationPayload } from '../../common/models/notification-payload.interface';
import { IStatusResponse } from '../../common/models/status-response.interface';
import {
  Subscription,
  UserSubscriptions,
  UserSubscriptionsDocument,
} from '../models/subscription.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webPush = require('web-push');

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel('subscription') private subscriptionModel: Model<UserSubscriptionsDocument>,
  ) {
    webPush.setVapidDetails(
      process.env.WEB_PUSH_CONTACT,
      process.env.PUBLIC_VAPID_KEY,
      process.env.PRIVATE_VAPID_KEY,
    );
  }

  async createUserSubscription(
    userId: string,
    subscription: Subscription,
  ): Promise<IStatusResponse> {
    const isExist = await this.subscriptionModel.exists({
      $and: [{ userId }, { 'subscriptions.userAgent': subscription.userAgent }],
    });
    if (isExist) {
      return { success: false, message: staticText.subscription.create.userAlreadySubscribed };
    }
    await this.subscriptionModel.findOneAndUpdate(
      { userId },
      {
        userId,
        subscriptions: [subscription],
      },
      { new: true, setDefaultsOnInsert: true, upsert: true },
    );
    return { success: true, message: staticText.subscription.create.success };
  }

  async notifySubscribers(userIds: string[], payload: INotificationPayload): Promise<any> {
    const subscriptionDocs: UserSubscriptions[] = await this.subscriptionModel.find(
      { userId: { $in: userIds } },
      { subscriptions: 1 },
    );
    const subscriptions: Subscription[] = subscriptionDocs.map((s) => s.subscriptions).flat();
    const parallelSubscriptionCalls = subscriptions.map(({ userAgent: _, ...sub }) => {
      return webPush.sendNotification(sub, JSON.stringify(payload));
    });
    return Promise.allSettled(parallelSubscriptionCalls);
  }
}
