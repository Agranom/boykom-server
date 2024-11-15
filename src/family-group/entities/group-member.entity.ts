import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
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
@Unique(['groupId', 'userId'])
@Index(['groupId'], { unique: true, where: '"is_owner" = true' })
export class GroupMember extends BaseEntity {
  @ManyToOne(() => FamilyGroup, (group) => group.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group?: FamilyGroup;

  @Column({ select: false })
  groupId: string;

  @ApiProperty()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ select: false })
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
