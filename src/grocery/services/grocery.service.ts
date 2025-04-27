import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { In, OptimisticLockVersionMismatchError } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { staticText } from '../../common/const/static-text';
import { INotificationPayload } from '../../common/models/notification-payload.interface';
import { FamilyGroupService } from '../../family-group/services/family-group.service';
import { AppLogger } from '../../providers/logger/logger.service';
import { eSocketEvent } from '../../providers/socket/enums/socket-event.enum';
import { SocketService } from '../../providers/socket/socket.service';
import { SubscriptionService } from '../../subsciption/services/subscription.service';
import { PatchGroceryDto } from '../dto/patch-grocery.dto';
import { Grocery } from '../entities/grocery.entity';
import { eGroceryItemStatus } from '../enums/grocery-item-status.enum';
import { GroceryCategoriesService } from './grocery-categories.service';
import { GroceryRepository } from './grocery.repository';
import { CreateGroceryDto } from '../dto/create-grocery.dto';
import { GroceryFilterDto } from '../dto/grocery-filter.dto';
import { EventBus } from '@nestjs/cqrs';
import { GroceryChangedEvent } from '../events/grocery-changed.event';

@Injectable()
export class GroceryService {
  constructor(
    private repository: GroceryRepository,
    private familyGroupService: FamilyGroupService,
    private subscriptionService: SubscriptionService,
    private socketService: SocketService,
    private logger: AppLogger,
    private groceryCategoryService: GroceryCategoriesService,
    private readonly eventBus: EventBus,
  ) {
    this.logger.setContext(GroceryService.name);
  }

  async createAndNotify(groceryDto: CreateGroceryDto, userId: string): Promise<Grocery> {
    const category = await this.groceryCategoryService.getCategory(groceryDto.name);
    const newItem = await this.repository.createOne({ ...groceryDto, userId, category });

    this.notifyOnCreate(userId, newItem.name);

    return newItem;
  }

  async findAll(userId: string, { inFridge }: GroceryFilterDto): Promise<Grocery[]> {
    const userFamilyGroup = await this.familyGroupService.getWithMembersByUserId(userId);
    const dbQuery: FindOptionsWhere<Grocery>[] | FindOptionsWhere<Grocery> = { userId };

    if (userFamilyGroup) {
      const activeMemberIds = FamilyGroupService.getActiveGroupMembers(userFamilyGroup).map(
        (m) => m.user.id,
      );
      const isMemberActive = activeMemberIds.includes(userId);

      if (isMemberActive) {
        dbQuery.userId = In(activeMemberIds);
      }
    }
    if (inFridge != null) {
      dbQuery.inFridge = inFridge;
    }

    return this.repository.find({ where: dbQuery, order: { createdAt: 1 } });
  }

  async updateById(
    id: string,
    { version, ...dto }: PatchGroceryDto,
    userId: string,
  ): Promise<Grocery> {
    try {
      const grocery = await this.repository.findOne({
        where: { id },
        lock: { mode: 'optimistic', version },
        select: ['id', 'version'],
      });

      if (!grocery) {
        throw new NotFoundException();
      }

      const newGrocery = await this.repository.save({ ...grocery, ...dto });

      this.eventBus.publish(new GroceryChangedEvent(userId));

      return newGrocery;
    } catch (e) {
      if (e instanceof OptimisticLockVersionMismatchError) {
        // TODO: [Translate] error
        throw new ConflictException(
          'The document has been updated by someone else. Please reload and try again.',
        );
      }
      throw e;
    }
  }

  async deleteById(id: string, userId: string): Promise<void> {
    const deleteResult = await this.repository.deleteById(id);

    if (deleteResult.affected) {
      this.eventBus.publish(new GroceryChangedEvent(userId));
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeCompleted(): Promise<void> {
    await this.repository.delete({ status: eGroceryItemStatus.Done });
  }

  async onGroceryChange(userId: string) {
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
