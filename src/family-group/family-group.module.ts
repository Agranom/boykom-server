import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionModule } from '../subsciption/subscription.module';
import { UserModule } from '../user/user.module';
import { FamilyGroupController } from './controllers/family-group.controller';
import { FamilyGroup } from './entities/family-group.entity';
import { GroupMember } from './entities/group-member.entity';
import { FamilyGroupService } from './services/family-group.service';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyGroup, GroupMember]), SubscriptionModule, UserModule],
  controllers: [FamilyGroupController],
  providers: [FamilyGroupService],
  exports: [FamilyGroupService],
})
export class FamilyGroupModule {}
