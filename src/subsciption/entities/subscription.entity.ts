import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

export class SubscriptionKeys {
  @ApiProperty()
  @IsString()
  p256dh: string;

  @ApiProperty()
  @IsString()
  auth: string;
}

@Entity({ name: 'subscriptions' })
@Unique('UQ_userId', ['userId'])
export class SubscriptionEntity extends BaseEntity {
  @ApiProperty({ type: User })
  @OneToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ select: false })
  userId: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'varchar', length: 300 })
  endpoint: string;

  @ApiProperty()
  @IsString()
  @Column({ type: 'varchar', length: 400 })
  userAgent: string;

  @ApiProperty({ type: SubscriptionKeys })
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => SubscriptionKeys)
  @Column('jsonb')
  keys: SubscriptionKeys;
}
