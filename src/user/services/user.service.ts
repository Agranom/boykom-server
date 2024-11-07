import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserDocument } from '../models/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    await new this.userModel(createUserDto).save();
  }

  async getUser(username: string | null, userId?: string): Promise<UserDocument> {
    const query = userId ? { _id: new mongoose.Types.ObjectId(userId) } : { username };
    const user: UserDocument | null = await this.userModel.findOne(query);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAll(excludeMe: boolean, userId: string): Promise<User[]> {
    const query = excludeMe ? { _id: { $nin: [userId] } } : {};
    const users: UserDocument[] = await this.userModel.find(query);
    return users.map((u) => u.toJSON());
  }
}
