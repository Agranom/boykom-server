import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { Column, Entity, Index, JoinColumn, ManyToOne, VersionColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { eGroceryItemPriority } from '../enums/grocery-item-priority.enum';
import { eGroceryItemStatus } from '../enums/grocery-item-status.enum';
import { eGroceryCategory } from '../interfaces/grocery-category.interface';

@Entity({ name: 'groceries' })
export class Grocery extends BaseEntity {
  @ApiProperty({ required: false })
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index()
  @Column({ select: false, nullable: false })
  userId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  @Column({ type: 'varchar', length: 30 })
  name: string;

  @ApiProperty()
  @IsEnum(eGroceryItemStatus)
  @IsOptional()
  @Column({ enum: eGroceryItemStatus, type: 'enum', default: eGroceryItemStatus.Undone })
  status: eGroceryItemStatus;

  @ApiProperty()
  @IsEnum(eGroceryItemPriority)
  @IsOptional()
  @Column({ enum: eGroceryItemPriority, type: 'enum', default: eGroceryItemPriority.Major })
  priority: eGroceryItemPriority;

  @Exclude()
  @IsEnum(eGroceryCategory)
  @Column({ enum: eGroceryCategory, type: 'enum', default: eGroceryCategory.Unknown })
  category: eGroceryCategory;

  @ApiProperty()
  @IsInt()
  @VersionColumn({ default: 1 })
  version: number;
}
