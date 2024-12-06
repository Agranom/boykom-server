import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { In } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { staticText } from '../../common/const/static-text';
import { INotificationPayload } from '../../common/models/notification-payload.interface';
import { FamilyGroupService } from '../../family-group/services/family-group.service';
import { AppLogger } from '../../providers/logger/logger.service';
import { eSocketEvent } from '../../providers/socket/enums/socket-event.enum';
import { SocketService } from '../../providers/socket/socket.service';
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
    private socketService: SocketService,
    private logger: AppLogger,
  ) {
    this.logger.setContext(GroceryService.name);
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
      const activeMemberIds = FamilyGroupService.getActiveGroupMembers(userFamilyGroup).map(
        (m) => m.user.id,
      );
      const isMemberActive = activeMemberIds.includes(userId);

      if (isMemberActive) {
        dbQuery = { userId: In(activeMemberIds) };
      }
    }

    return this.repository.find({ where: dbQuery, order: { createdAt: 1 } });
  }

  async updateById(id: string, groceryDto: UpsertGroceryDto, userId: string): Promise<Grocery> {
    const result = await this.repository.findOneAndUpdate({ id }, groceryDto);

    if (!result) {
      throw new NotFoundException();
    }

    this.onGroceryChange(userId);

    return result;
  }

  async deleteById(id: string, userId: string): Promise<void> {
    const deleteResult = await this.repository.deleteById(id);

    if (!deleteResult.affected) {
      throw new NotFoundException();
    }

    this.onGroceryChange(userId);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeCompleted(): Promise<void> {
    await this.repository.deleteMany({ status: eGroceryItemStatus.Done });
  }

  private async onGroceryChange(userId: string) {
    try {
      const result = await this.familyGroupService.getMemberWithSiblingsByUserId(userId);

      if (!result) {
        return;
      }

      const { siblings } = result;
      const siblingUserIds = siblings.map((s) => s.user.id);

      this.notifyGroupMemberSiblings(siblingUserIds);
    } catch (e) {
      this.logger.error(`Couldn't notify siblings by socket.`, e);
    }
  }

  // TODO: use RabbitMQ
  private async notifyOnCreate(userId: string, groceryName: string): Promise<void> {
    try {
      const result = await this.familyGroupService.getMemberWithSiblingsByUserId(userId);

      if (!result) {
        return;
      }

      const { primaryMember, siblings } = result;
      const siblingUserIds = siblings.map((s) => s.user.id);

      const payload: INotificationPayload = {
        title: staticText.grocery.newProductNotificationTitle(
          primaryMember.user.firstName,
          primaryMember.user.lastName,
        ),
        body: groceryName,
      };
      // Should be run in background, so that don't need to add `await`
      this.subscriptionService.notifySubscribers(siblingUserIds, payload);

      this.notifyGroupMemberSiblings(siblingUserIds);
    } catch (e) {
      this.logger.error(`Couldn't notify siblings.`, e);
    }
  }

  private notifyGroupMemberSiblings(userIds: string[]) {
    this.socketService.sendToUsers(userIds, eSocketEvent.GroceryChanged);
  }
}
