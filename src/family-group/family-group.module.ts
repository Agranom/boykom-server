import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionModule } from '../subsciption/subscription.module';
import { UserModule } from '../user/user.module';
import { FamilyGroupController } from './controllers/family-group.controller';
import { FamilyGroupEntity } from './entities/family-group.entity';
import { GroupMemberEntity } from './entities/group-member.entity';
import { FamilyGroupSchema } from './models/family-group.schema';
import { FamilyGroupService } from './services/family-group.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'familyGroup', schema: FamilyGroupSchema }]),
    TypeOrmModule.forFeature([FamilyGroupEntity, GroupMemberEntity]),
    SubscriptionModule,
    UserModule,
  ],
  controllers: [FamilyGroupController],
  providers: [FamilyGroupService],
  exports: [FamilyGroupService],
})
export class FamilyGroupModule {}
