import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { eGroceryItemStatus } from '../models/grocery.model';

@Entity({ name: 'groceries' })
export class GroceryEntity extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ enum: eGroceryItemStatus, type: 'enum', default: eGroceryItemStatus.Undone })
  status: eGroceryItemStatus;

  @Column({ type: 'varchar', length: 30 })
  priority: string;
}
