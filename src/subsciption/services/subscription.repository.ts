import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityRepository } from '../../common/services/entity.repository';
import { SubscriptionEntity } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionRepository extends EntityRepository<SubscriptionEntity> {
  constructor(@InjectRepository(SubscriptionEntity) repository: Repository<SubscriptionEntity>) {
    super(repository);
  }
}
