import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 300 })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;
}
