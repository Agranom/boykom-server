import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { eGroceryItemPriority } from '../enums/grocery-item-priority.enum';
import { eGroceryItemStatus } from '../enums/grocery-item-status.enum';

@Entity({ name: 'groceries' })
export class Grocery extends BaseEntity {
  @ApiProperty({ required: false })
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ select: false, nullable: false })
  userId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  @Column({ type: 'varchar', length: 30 })
  name: string;

  @ApiProperty()
  @IsEnum(eGroceryItemStatus)
  @Column({ enum: eGroceryItemStatus, type: 'enum', default: eGroceryItemStatus.Undone })
  status: eGroceryItemStatus;

  @ApiProperty()
  @IsEnum(eGroceryItemPriority)
  @Column({ enum: eGroceryItemPriority, default: eGroceryItemPriority.Major })
  priority: eGroceryItemPriority;
}
