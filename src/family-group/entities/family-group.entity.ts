import { Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { GroupMemberEntity } from './group-member.entity';

@Entity({ name: 'family_groups' })
export class FamilyGroupEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: UserEntity;

  @OneToMany(() => GroupMemberEntity, (member) => member.group)
  members: GroupMemberEntity[];
}
