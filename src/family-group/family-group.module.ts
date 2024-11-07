import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionModule } from '../notification/subscription.module';
import { UserModule } from '../user/user.module';
import { FamilyGroupController } from './controllers/family-group.controller';
import { FamilyGroupSchema } from './models/family-group.schema';
import { FamilyGroupService } from './services/family-group.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'familyGroup', schema: FamilyGroupSchema }]),
    SubscriptionModule,
    UserModule,
  ],
  controllers: [FamilyGroupController],
  providers: [FamilyGroupService],
  exports: [FamilyGroupService],
})
export class FamilyGroupModule {}
