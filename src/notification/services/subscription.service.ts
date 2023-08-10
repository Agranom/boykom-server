import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { INotificationPayload } from '../../common/models/notification-payload.interface';
import { Subscription, UserSubscriptions, UserSubscriptionsDocument } from '../models/subscription.model';

const webPush = require('web-push');

@Injectable()
export class SubscriptionService {
  constructor(@InjectModel('subscription') private subscriptionModel: Model<UserSubscriptionsDocument>) {
    webPush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);
  }

  async createUserSubscription(userId: string, subscription: Subscription): Promise<any> {
    return this.subscriptionModel.findOneAndUpdate({ userId }, {
      userId,
      $addToSet: { subscriptions: subscription },
    }, { new: true, setDefaultsOnInsert: true, upsert: true });
  }

  async notifySubscribers(userIds: string[], payload: INotificationPayload): Promise<any> {
    const subscriptionDocs: UserSubscriptions[] = await this.subscriptionModel.find({ userId: { $in: userIds } }, { subscriptions: 1 });
    const subscriptions: Subscription[] = subscriptionDocs.map(s => s.subscriptions).flat();
    const parallelSubscriptionCalls = subscriptions.map((subscription) => {
      return webPush.sendNotification(subscription, JSON.stringify(payload));
    });
    return Promise.allSettled(parallelSubscriptionCalls);
  }

}
