import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { eGroceryItemStatus } from '../models/grocery.model';

@Entity({ name: 'groceries' })
export class GroceryEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ enum: eGroceryItemStatus, type: 'enum', default: eGroceryItemStatus.Undone })
  status: eGroceryItemStatus;

  @Column({ type: 'varchar', length: 30 })
  priority: string;
}
