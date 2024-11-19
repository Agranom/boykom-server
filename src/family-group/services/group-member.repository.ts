import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityRepository } from '../../common/services/entity.repository';
import { GroupMember } from '../entities/group-member.entity';

@Injectable()
export class GroupMemberRepository extends EntityRepository<GroupMember> {
  constructor(@InjectRepository(GroupMember) repository: Repository<GroupMember>) {
    super(repository);
  }

  async isMemberExist(userIds: string[]): Promise<boolean> {
    return this.repository
      .createQueryBuilder('member')
      .where('member.userId IN (:...userIds)', { userIds })
      .getExists();
  }
}
