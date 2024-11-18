import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityRepository } from '../../common/services/entity.repository';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionRepository extends EntityRepository<Subscription> {
  constructor(@InjectRepository(Subscription) repository: Repository<Subscription>) {
    super(repository);
  }
}
