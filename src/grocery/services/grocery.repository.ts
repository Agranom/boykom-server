import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityRepository } from '../../common/services/entity.repository';
import { Grocery } from '../entities/grocery.entity';

@Injectable()
export class GroceryRepository extends EntityRepository<Grocery> {
  constructor(@InjectRepository(Grocery) repository: Repository<Grocery>) {
    super(repository);
  }
}
