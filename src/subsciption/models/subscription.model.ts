import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserSubscriptionsDocument = UserSubscriptions & Document;

export class SubscriptionKeys {
  p256dh: string;
  auth: string;
}

export class Subscription {
  endpoint: string;
  keys: SubscriptionKeys;
  expirationTime: number | null;
  userAgent: string;
}

@Schema({ versionKey: false })
export class UserSubscriptions {
  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ default: [] })
  subscriptions: Subscription[];
}

export const UserSubscriptionsSchema = SchemaFactory.createForClass(UserSubscriptions);
