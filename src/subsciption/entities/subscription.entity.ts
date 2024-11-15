import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { SubscriptionKeys } from '../models/subscription.model';

@Entity({ name: 'subscriptions' })
export class SubscriptionEntity extends BaseEntity {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 300 })
  endpoint: string;

  @Column({ type: 'varchar', length: 400 })
  userAgent: string;

  @Column('jsonb')
  keys: SubscriptionKeys;
}
