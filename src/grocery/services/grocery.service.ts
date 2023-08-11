import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { staticText } from '../../common/const/static-text';
import { INotificationPayload } from '../../common/models/notification-payload.interface';
import { FamilyGroupService } from '../../family-group/services/family-group.service';
import { SubscriptionService } from '../../notification/services/subscription.service';
import { CreateGroceryDto } from '../dto/create-grocery.dto';
import { eGroceryItemStatus } from '../models/grocery.model';
import { Grocery } from '../schemas/grocery.schema';

@Injectable()
export class GroceryService {
  constructor(@InjectModel('grocery') private groceryModel: Model<Grocery>,
              private familyGroupService: FamilyGroupService,
              private subscriptionService: SubscriptionService) {
  }

  async create(groceryDto: CreateGroceryDto, userId: string): Promise<Grocery> {
    const item = new this.groceryModel({ ...groceryDto, userId });
    await item.save();
    const familyGroup = await this.familyGroupService.getByUserId(userId);
    if (familyGroup) {
      const notifierIds = [familyGroup.ownerId, ...familyGroup.memberIds];
      const paylod: INotificationPayload = {
        title: staticText.grocery.newProductNotificationTitle,
        body: item.name,
      };
      // Should be run in background, so that don't need to add `await`
      this.subscriptionService.notifySubscribers(notifierIds, paylod);
    }
    return item.toJSON();
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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeCompleted(): Promise<void> {
    await this.groceryModel.deleteMany({status: eGroceryItemStatus.Done});
  }
}
