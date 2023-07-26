import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

export type UserDocument = User & Document

@Schema({ validateBeforeSave: true })
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true, minLength: 4 })
  password: string;

  validatePassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function(next) {
  const thisObj = this as UserDocument;

  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    thisObj.password = await bcrypt.hash(thisObj.password, salt);
    return next();
  } catch (e) {
    return next(e);
  }
});

UserSchema.methods.validatePassword= async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
}
