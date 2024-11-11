import { Exclude } from 'class-transformer';
import { User } from '../entities/user.entity';

export class UserWithoutPasswordDto extends User {
  @Exclude()
  password: string;
}
