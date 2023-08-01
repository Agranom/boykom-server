import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FamilyGroupService } from '../../family-group/services/family-group.service';
import { CreateGroceryDto } from '../dto/create-grocery.dto';
import { Grocery } from '../schemas/grocery.schema';

@Injectable()
export class GroceryService {
  constructor(@InjectModel('grocery') private groceryModel: Model<Grocery>,
              private familyGroupService: FamilyGroupService) {
  }

  async create(groceryDto: CreateGroceryDto, userId: string): Promise<Grocery> {
    try {
      const item = new this.groceryModel({ ...groceryDto, userId });
      await item.save();
      return item.toJSON();
    } catch (e) {
      return e;
    }
  }

  async findAll(userId: string): Promise<Grocery[]> {
    const userFamilyGroup = await this.familyGroupService.getByUserId(userId);
    let dbQuery = { userId } as { [key: string]: any };
    if (userFamilyGroup) {
      const groupMemberIds: string[] = [...userFamilyGroup.memberIds, userFamilyGroup.ownerId];
      dbQuery = { userId: { $in: groupMemberIds } };
    }
    return this.groceryModel.find(dbQuery).sort({ createdAt: 1 }).exec();
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
