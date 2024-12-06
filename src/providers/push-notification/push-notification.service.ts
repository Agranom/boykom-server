import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setVapidDetails, sendNotification, PushSubscription } from 'web-push';
import { INotificationPayload } from '../../common/models/notification-payload.interface';
import { WebPushConfig } from '../../config/web-push.config';

@Injectable()
export class PushNotificationService {
  constructor(private configService: ConfigService) {
    const { webPushContact, publicVapidKey, privateVapidKey } =
      this.configService.getOrThrow<WebPushConfig>('webPush');

    setVapidDetails(webPushContact, publicVapidKey, privateVapidKey);
  }

  async send(subscription: PushSubscription, payload: INotificationPayload): Promise<void> {
    await sendNotification(subscription, JSON.stringify(payload));
  }
}
