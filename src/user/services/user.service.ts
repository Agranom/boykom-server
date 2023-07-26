import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDocument } from '../models/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private userModel: Model<UserDocument>) {
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    await new this.userModel(createUserDto).save();
  }

  async getUser(username: string): Promise<UserDocument> {
    const user: UserDocument | null = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

}

