import { Injectable, PipeTransform } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class ObjectIdPipe implements PipeTransform {
  transform(value: string): mongoose.Types.ObjectId | null {
    if (value) {
      return new mongoose.Types.ObjectId(value);
    }
    return null;
  }
}
