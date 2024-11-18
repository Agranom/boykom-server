import { DeepPartial, DeleteResult, InsertResult, Repository } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';

export abstract class EntityRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async createOne(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data) as T;

    return this.repository.save(entity);
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async updateOne(query: ObjectLiteral, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    const result = await this.repository
      .createQueryBuilder()
      .update()
      .set(data)
      .where(query)
      .returning('*')
      .execute();

    return result.raw[0];
  }

  async upsertOne(
    data: QueryDeepPartialEntity<T>,
    conflictPathsOrOptions: string[] | UpsertOptions<T>,
  ): Promise<InsertResult> {
    return this.repository.upsert(data, conflictPathsOrOptions);
  }

  async deleteById(id: string): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  async deleteMany(query: FindOptionsWhere<T>): Promise<DeleteResult> {
    return this.repository.delete(query);
  }

  async exists(options?: FindManyOptions<T>): Promise<boolean> {
    return this.repository.exists(options);
  }
}
