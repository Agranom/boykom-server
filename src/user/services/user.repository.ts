import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityRepository } from '../../common/services/entity.repository';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends EntityRepository<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  async getUserWithPassword(username: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.username = :username', { username })
      .getOne();
  }
}
