import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Not } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserWithoutPasswordDto } from '../dto/user-without-password.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    createUserDto.password = await User.hashPassword(createUserDto.password);

    await this.repository.createOne(createUserDto);
  }

  async getUserById(id: string): Promise<User> {
    const result = await this.repository.findById(id);

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
      result = await this.repository.getUserWithPassword(username);
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
