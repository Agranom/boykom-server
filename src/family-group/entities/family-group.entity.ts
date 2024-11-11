import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { GroupMemberEntity } from './group-member.entity';

@Entity({ name: 'family_groups' })
export class FamilyGroupEntity extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @OneToMany(() => GroupMemberEntity, (member) => member.group)
  members: GroupMemberEntity[];
}
