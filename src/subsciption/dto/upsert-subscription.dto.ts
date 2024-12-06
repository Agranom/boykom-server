import { PickType } from '@nestjs/swagger';
import { Subscription } from '../entities/subscription.entity';

export class UpsertSubscriptionDto extends PickType(Subscription, ['endpoint', 'keys']) {}
