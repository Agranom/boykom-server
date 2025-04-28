import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { FamilyGroup } from './entities/family-group.entity';
import { GroupMember } from './entities/group-member.entity';
import { FamilyGroupService } from './services/family-group.service';
import { FamilyGroupController } from './controllers/family-group.controller';
import { SubscriptionModule } from '../subsciption/subscription.module';
import { UserModule } from '../user/user.module';
import { FamilyGroupRepository } from './services/family-group.repository';
import { GroupMemberRepository } from './services/group-member.repository';
import { NotifyGroupMembersHandler } from './commands/handlers/notify-group-members.handler';
import { FamilyGroupSagas } from './sagas/family-group.sagas';
import { LoggerModule } from '../providers/logger/logger.module';

const CommandHandlers = [NotifyGroupMembersHandler];
const Sagas = [FamilyGroupSagas];

@Module({
  imports: [
    TypeOrmModule.forFeature([FamilyGroup, GroupMember]),
    SubscriptionModule,
    UserModule,
    CqrsModule,
    LoggerModule,
  ],
  providers: [
    ...CommandHandlers,
    ...Sagas,
    FamilyGroupService,
    FamilyGroupRepository,
    GroupMemberRepository,
  ],
  controllers: [FamilyGroupController],
  exports: [FamilyGroupService],
})
export class FamilyGroupModule {}
