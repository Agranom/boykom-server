import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionModule } from '../subsciption/subscription.module';
import { UserModule } from '../user/user.module';
import { FamilyGroupController } from './controllers/family-group.controller';
import { FamilyGroup } from './entities/family-group.entity';
import { GroupMember } from './entities/group-member.entity';
import { FamilyGroupRepository } from './services/family-group.repository';
import { FamilyGroupService } from './services/family-group.service';
import { GroupMemberRepository } from './services/group-member.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyGroup, GroupMember]), SubscriptionModule, UserModule],
  controllers: [FamilyGroupController],
  providers: [FamilyGroupService, FamilyGroupRepository, GroupMemberRepository],
  exports: [FamilyGroupService],
})
export class FamilyGroupModule {}
