import { PickType } from '@nestjs/swagger';
import { SubscriptionEntity } from '../entities/subscription.entity';

export class CreateSubscriptionDto extends PickType(SubscriptionEntity, ['endpoint', 'keys']) {}
