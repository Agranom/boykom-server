import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { FamilyGroupEntity } from './family-group.entity';

@Entity({ name: 'group_members' })
export class GroupMemberEntity extends BaseEntity {
  @ManyToOne(() => FamilyGroupEntity, (group) => group.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: FamilyGroupEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
