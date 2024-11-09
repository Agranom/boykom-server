import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { SubscriptionKeys } from '../models/subscription.model';

@Entity({ name: 'subscriptions' })
export class SubscriptionEntity extends BaseEntity {
  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 300 })
  endpoint: string;

  @Column({ type: 'varchar', length: 400 })
  userAgent: string;

  @Column('jsonb')
  keys: SubscriptionKeys;
}
