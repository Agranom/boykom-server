import { ConfigHelper } from './config.helper';

export interface RmqConfig {
  url: string;
  groceryQueue: string;
}

export const rmqConfig = (): RmqConfig => ({
  url: ConfigHelper.getOrThrow('RABBITMQ_URL'),
  groceryQueue: ConfigHelper.getOrThrow('RABBITMQ_GROCERY_QUEUE'),
});
