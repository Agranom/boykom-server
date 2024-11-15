import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserWithoutPasswordDto } from '../dto/user-without-password.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    createUserDto.password = await User.hashPassword(createUserDto.password);

    await this.repository.save(createUserDto);
  }

  async getUserById(id: string): Promise<User> {
    const result = await this.repository.findOne({ where: { id } });

    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return result;
  }

  async getUserByUsername(
    username: string,
    { includePassword } = { includePassword: false },
  ): Promise<User> {
    let result: User | null;

    if (includePassword) {
      result = await this.repository
        .createQueryBuilder('users')
        .addSelect('users.password')
        .where('users.username = :username', { username })
        .getOne();
    } else {
      result = await this.repository.findOne({
        where: { username },
      });
    }

    if (!result) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return result;
  }

  async getAll(excludeMe: boolean, userId: string): Promise<UserWithoutPasswordDto[]> {
    let users: User[];

    if (excludeMe) {
      users = await this.repository.findBy({ id: Not(userId) });
    } else {
      users = await this.repository.find();
    }

    return users.map((u) => plainToInstance(UserWithoutPasswordDto, u));
  }
}
