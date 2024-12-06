import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { Unique } from 'typeorm/browser';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', length: 300, select: false })
  password: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  static async isPasswordValid(password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
