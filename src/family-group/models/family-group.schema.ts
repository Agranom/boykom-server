import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FamilyGroupDocument = FamilyGroup & Document;

@Schema({ versionKey: false, virtuals: true })
export class FamilyGroup {
  @Prop({ required: true, unique: true })
  ownerId: string;

  @Prop({ type: [String], required: true })
  memberIds: string[];
}

export const FamilyGroupSchema = SchemaFactory.createForClass(FamilyGroup);

FamilyGroupSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
  },
})
