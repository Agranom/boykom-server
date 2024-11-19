import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityRepository } from '../../common/services/entity.repository';
import { FamilyGroup } from '../entities/family-group.entity';

@Injectable()
export class FamilyGroupRepository extends EntityRepository<FamilyGroup> {
  constructor(@InjectRepository(FamilyGroup) repository: Repository<FamilyGroup>) {
    super(repository);
  }
}
