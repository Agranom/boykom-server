import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FamilyGroupDocument = FamilyGroup & Document;

@Schema({ virtuals: false, versionKey: false })
export class GroupMember {
  @Prop({ required: true, type: String })
  id: string;

  @Prop({ type: Boolean, default: false })
  isAccepted: boolean;
}

const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);

@Schema({ versionKey: false, virtuals: true })
export class FamilyGroup {
  @Prop({ required: true, unique: true })
  ownerId: string;

  @Prop({ required: true, type: [GroupMemberSchema] })
  members: GroupMember[];
}

export const FamilyGroupSchema = SchemaFactory.createForClass(FamilyGroup);

FamilyGroupSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
  },
});
