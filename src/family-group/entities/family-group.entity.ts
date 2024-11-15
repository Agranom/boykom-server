import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { GroupMember } from './group-member.entity';

@Entity({ name: 'family_groups' })
@Unique(['owner'])
export class FamilyGroup extends BaseEntity {
  @ApiProperty()
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ApiProperty()
  @OneToMany(() => GroupMember, (member) => member.group)
  members: GroupMember[];

  @Column({ select: false })
  ownerId: string;
}
