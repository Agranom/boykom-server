import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { In } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { staticText } from '../../common/const/static-text';
import { INotificationPayload } from '../../common/models/notification-payload.interface';
import { FamilyGroup } from '../../family-group/entities/family-group.entity';
import { FamilyGroupService } from '../../family-group/services/family-group.service';
import { SubscriptionService } from '../../subsciption/services/subscription.service';
import { UpsertGroceryDto } from '../dto/upsert-grocery.dto';
import { Grocery } from '../entities/grocery.entity';
import { eGroceryItemStatus } from '../enums/grocery-item-status.enum';
import { GroceryRepository } from './grocery.repository';

@Injectable()
export class GroceryService {
  constructor(
    private repository: GroceryRepository,
    private familyGroupService: FamilyGroupService,
    private subscriptionService: SubscriptionService,
  ) {}

  private static getActiveGroupMembersIds(familyGroup: FamilyGroup): string[] {
    return familyGroup.members.filter((m) => m.isAccepted).map((m) => m.user.id);
  }

  async createAndNotify(groceryDto: UpsertGroceryDto, userId: string): Promise<Grocery> {
    const newItem = await this.repository.createOne({ ...groceryDto, userId });

    this.notifyOnCreate(userId, newItem.name);

    return newItem;
  }

  async findAll(userId: string): Promise<Grocery[]> {
    const userFamilyGroup = await this.familyGroupService.getWithMembersByUserId(userId);
    let dbQuery: FindOptionsWhere<Grocery>[] | FindOptionsWhere<Grocery> = { userId };

    if (userFamilyGroup) {
      const activeMemberIds = GroceryService.getActiveGroupMembersIds(userFamilyGroup);
      const isMemberActive = activeMemberIds.includes(userId);

      if (isMemberActive) {
        dbQuery = { userId: In(activeMemberIds) };
      }
    }

    return this.repository.find({ where: dbQuery, order: { createdAt: 1 } });
  }

  async updateById(id: string, groceryDto: UpsertGroceryDto): Promise<Grocery> {
    const result = await this.repository.updateOne({ id }, groceryDto);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async deleteById(id: string): Promise<void> {
    const deleteResult = await this.repository.deleteById(id);

    if (!deleteResult.affected) {
      throw new NotFoundException();
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeCompleted(): Promise<void> {
    await this.repository.deleteMany({ status: eGroceryItemStatus.Done });
  }

  // TODO: use RabbitMQ
  private async notifyOnCreate(creatorId: string, groceryName: string): Promise<void> {
    try {
      const familyGroup = await this.familyGroupService.getWithMembersByUserId(creatorId);

      if (familyGroup) {
        const user = familyGroup.members.find((m) => m.user.id === creatorId && m.isAccepted)?.user;

        if (user) {
          const memberIds = GroceryService.getActiveGroupMembersIds(familyGroup);
          const notifierIds = memberIds.filter((id) => id !== creatorId);
          const payload: INotificationPayload = {
            title: staticText.grocery.newProductNotificationTitle(user.firstName, user.lastName),
            body: groceryName,
          };
          // Should be run in background, so that don't need to add `await`
          this.subscriptionService.notifySubscribers(notifierIds, payload);
        }
      }
    } catch (e) {
      console.error(`Couldn't notify members.`, e);
    }
  }
}
