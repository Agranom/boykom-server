import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { staticText } from '../../common/const/static-text';
import { INotificationPayload } from '../../common/models/notification-payload.interface';
import { FamilyGroup } from '../../family-group/models/family-group.schema';
import { FamilyGroupService } from '../../family-group/services/family-group.service';
import { SubscriptionService } from '../../subsciption/services/subscription.service';
import { UserService } from '../../user/services/user.service';
import { CreateGroceryDto } from '../dto/create-grocery.dto';
import { eGroceryItemStatus } from '../models/grocery.model';
import { Grocery } from '../schemas/grocery.schema';

@Injectable()
export class GroceryService {
  constructor(
    @InjectModel('grocery') private groceryModel: Model<Grocery>,
    private familyGroupService: FamilyGroupService,
    private subscriptionService: SubscriptionService,
    private userService: UserService,
  ) {}

  private static getActiveGroupMembersIds(familyGroup: FamilyGroup): string[] {
    return familyGroup.members.filter((m) => m.isAccepted).map((m) => m.userId);
  }

  async create(groceryDto: CreateGroceryDto, userId: string, username: string): Promise<Grocery> {
    const item = new this.groceryModel({ ...groceryDto, userId });
    await item.save();
    const familyGroup = await this.familyGroupService.getByUserId(userId);
    if (familyGroup) {
      const memberIds = GroceryService.getActiveGroupMembersIds(familyGroup);
      const notifierIds = [familyGroup.ownerId, ...memberIds].filter((id) => id !== userId);
      const user = await this.userService.getUserByUsername(username);
      const payload: INotificationPayload = {
        title: staticText.grocery.newProductNotificationTitle(user.firstName, user.lastName),
        body: item.name,
      };
      // Should be run in background, so that don't need to add `await`
      this.subscriptionService.notifySubscribers(notifierIds, payload);
    }
    return item.toJSON();
  }

  async findAll(userId: string): Promise<Grocery[]> {
    const userFamilyGroup = await this.familyGroupService.getByUserId(userId);
    let dbQuery = { userId } as { [key: string]: any };
    if (userFamilyGroup) {
      const memberIds = GroceryService.getActiveGroupMembersIds(userFamilyGroup);
      const isMemberActive =
        userFamilyGroup.members.find((m) => m.userId === userId)?.isAccepted ||
        userFamilyGroup.ownerId === userId;
      if (isMemberActive) {
        const groupMemberIds: string[] = [...memberIds, userFamilyGroup.ownerId];
        dbQuery = { userId: { $in: groupMemberIds } };
      }
    }
    return this.groceryModel.find(dbQuery).sort({ createdAt: 1 }).exec();
  }

  async updateById(id: string, groceryDto: CreateGroceryDto): Promise<Grocery | NotFoundException> {
    try {
      const newItem = await this.groceryModel.findByIdAndUpdate(
        id,
        { $set: groceryDto },
        { new: true },
      );
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
    await this.groceryModel.deleteMany({ status: eGroceryItemStatus.Done });
  }
}
