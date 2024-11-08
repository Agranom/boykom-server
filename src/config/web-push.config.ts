import { ConfigHelper } from './config.helper';

export interface WebPushConfig {
  publicVapidKey: string;
  privateVapidKey: string;
  webPushContact: string;
}

export const webPushConfig = (): WebPushConfig => ({
  publicVapidKey: ConfigHelper.getOrThrow('PUBLIC_VAPID_KEY'),
  privateVapidKey: ConfigHelper.getOrThrow('PRIVATE_VAPID_KEY'),
  webPushContact: ConfigHelper.getOrThrow('WEB_PUSH_CONTACT'),
});
