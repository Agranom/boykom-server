import { DeepPartial, DeleteResult, InsertResult, Repository } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { BaseEntity } from '../entities/base.entity';
import {
  FindOptionsSelect,
  FindOptionsSelectByString,
} from 'typeorm/find-options/FindOptionsSelect';
import {
  FindOptionsRelationByString,
  FindOptionsRelations,
} from 'typeorm/find-options/FindOptionsRelations';

function snakeToCamelCase(obj: Record<string, any>): Record<string, any> {
  if (!obj || typeof obj !== 'object') {
    return obj; // Return the value directly if it's not an object
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamelCase); // Recursively handle arrays
  }

  const toCamel = (str: string) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = toCamel(key); // Convert key to camelCase
    acc[camelKey] = snakeToCamelCase(obj[key]); // Recursively convert nested objects
    return acc;
  }, {} as Record<string, any>);
}

export abstract class EntityRepository<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async createOne(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data) as T;

    return this.repository.save(entity);
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findById(
    id: string,
    options?: { select?: FindOptionsSelect<T>; relations?: FindOptionsRelations<T> },
  ): Promise<T | null> {
    return this.repository.findOne({ where: { id } as FindOptionsWhere<T>, ...(options || {}) });
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async findBy(query: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.findBy(query);
  }

  async findOneAndUpdate(
    query: ObjectLiteral,
    data: QueryDeepPartialEntity<T>,
    returnColumns?: (keyof T)[],
  ): Promise<T | null> {
    const isReturning = !!returnColumns?.length;
    const returning: string[] = isReturning ? (returnColumns as string[]) : ['id'];

    const result = await this.repository
      .createQueryBuilder()
      .update()
      .set(data)
      .where(query)
      .returning(returning)
      .execute();

    const affectedEntity = result.raw[0];

    if (!result.affected && !affectedEntity) {
      return null;
    }

    if (isReturning) {
      return snakeToCamelCase(affectedEntity) as T;
    }

    return affectedEntity;
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

  async delete(query: FindOptionsWhere<T>): Promise<DeleteResult> {
    return this.repository.delete(query);
  }

  async exists(options?: FindManyOptions<T>): Promise<boolean> {
    return this.repository.exists(options);
  }
}
