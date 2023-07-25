import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroceryDto } from '../dto/create-grocery.dto';
import { Grocery } from '../schemas/grocery.schema';

@Injectable()
export class GroceryService {
  constructor(@InjectModel('grocery') private groceryModel: Model<Grocery>) {
  }

  async create(groceryDto: CreateGroceryDto): Promise<Grocery> {
    try {
      const item = new this.groceryModel(groceryDto);
      await item.save();
      return item.toJSON();
    } catch (e) {
      return e;
    }
  }

  async findAll(): Promise<Grocery[]> {
    try {
      return this.groceryModel.find().sort({createdAt: 1}).exec();
    } catch (e) {
      return e;
    }
  }

  async updateById(id: string, groceryDto: CreateGroceryDto): Promise<Grocery | NotFoundException> {
    try {
      const newItem = await this.groceryModel.findByIdAndUpdate(id, { $set: groceryDto }, { new: true });
      if (!newItem) {
        return new NotFoundException();
      }
      return newItem.toJSON() as Grocery;
    } catch (e) {
      return e;
    }
  }

  async deleteById(id: string): Promise<{ id: string } | NotFoundException> {
    try {
      const deletedItem = await this.groceryModel.findByIdAndRemove(id);
      if (!deletedItem) {
        return new NotFoundException();
      }
      return { id };
    } catch (e) {
      return e;
    }
  }

  //
  // async changeStatusById(id: string, status: eGroceryItemStatus): Promise<eGroceryItemStatus | NotFoundException> {
  //
  // }
}
