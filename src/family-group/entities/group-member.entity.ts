import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { FamilyGroup } from './family-group.entity';

@Entity({ name: 'group_members' })
@Index('IDX_GROUP_MEMBERS_group_id_WHERE_is_owner_TRUE', ['groupId'], {
  unique: true,
  where: '"is_owner" = true',
})
export class GroupMember extends BaseEntity {
  @ManyToOne(() => FamilyGroup, (group) => group.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group?: FamilyGroup;

  @Index()
  @Column({ select: false })
  groupId: string;

  @ApiProperty()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ select: false, unique: true })
  userId: string;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isAccepted: boolean;

  @ApiProperty()
  @Column({ type: 'boolean', default: false })
  isOwner: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  setIsAcceptedBasedOnIsOwner() {
    if (this.isOwner) {
      this.isAccepted = true;
    } else if (typeof this.isAccepted === 'undefined') {
      // Only set to false if isAccepted is not already set
      this.isAccepted = false;
    }
  }
}
