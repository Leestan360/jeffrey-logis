import { Logger } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { ErrorResultTuple } from './error/error-result-tuple';
import { DbException } from './error/exceptions/db.exception';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { RecordNotFoundException } from './error/exceptions/not-found.exception';

export abstract class BaseRepository<T> {
  protected readonly repository: Repository<T>;
  private readonly entityName: string;
  protected readonly logger = new Logger(BaseRepository.name);

  constructor(repository: Repository<T>) {
    this.repository = repository;
    this.entityName = this.repository.target.toString();
  }

  // Saves a record to the DB
  protected async save(data: DeepPartial<T>): Promise<ErrorResultTuple<T>> {
    this.logger.log(`DB [save] ${this.entityName}`);
    try {
      const savedRecord = await this.repository.save(data);
      return [null, savedRecord];
    } catch (error) {
      this.logger.error(
        `DB [save] ${this.entityName}, error: ${error.message} `,
      );
      return [new DbException(), null];
    }
  }

  // Find one record by field
  protected async findOneByField(
    options?: FindOneOptions<T>,
  ): Promise<ErrorResultTuple<T>> {
    this.logger.log(
      `DB [findOneByField] ${
        this.entityName
      }, key, value: ${options.where.toString()}`,
    );
    try {
      const foundRecord = await this.repository.findOne(options);
      if (foundRecord) return [null, foundRecord];
      return [new RecordNotFoundException(), null];
    } catch (error) {
      this.logger.error(
        `DB [findOneByField] ${
          this.entityName
        }, key, value: ${options.where.toString()}, ${error.message}`,
      );
      return [new DbException(), null];
    }
  }

  // Update by field
  protected async updateByField(
    options: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    this.logger.log(`DB [updateByField] ${this.entityName}`);

    try {
      const updatedRecord = await this.repository.update(
        options,
        partialEntity,
      );
      if (updatedRecord.affected === 0)
        return [new RecordNotFoundException(), null];
      return [null, updatedRecord];
    } catch (error) {
      this.logger.error(
        `DB [updateByField] ${this.entityName}, ${error.message}`,
      );
      return [new DbException(), null];
    }
  }

  // Find many
  protected async findAll(
    options?: FindManyOptions<T>,
  ): Promise<ErrorResultTuple<T[]>> {
    this.logger.log(`DB [findAll] ${this.entityName}`);
    try {
      const data = await this.repository.find(options);
      return [null, data];
    } catch (error) {
      this.logger.error(
        `DB [findAndCount] ${this.entityName}, ${error.message}`,
      );
      return [new DbException(), null];
    }
  }

  // Delete by field
  protected async deleteByField(
    options: FindOptionsWhere<T>,
  ): Promise<ErrorResultTuple<number>> {
    this.logger.log(`DB [deleteByField] ${this.entityName}`);

    try {
      const data = await this.repository.delete(options);
      return [null, data.affected];
    } catch (error) {
      this.logger.error(
        `DB [findAndCount] ${this.entityName}, ${error.message}`,
      );
      return [new DbException(), null];
    }
  }

  // Soft delete by field
  protected async softDeleteByField(
    options: FindOptionsWhere<T>,
  ): Promise<ErrorResultTuple<number>> {
    this.logger.log(`DB [softDeleteByField] ${this.entityName}`);

    try {
      const data = await this.repository.softDelete(options);
      return [null, data.affected];
    } catch (error) {
      this.logger.error(
        `DB [softDeleteByField]] ${this.entityName}, ${error.message}`,
      );
      return [new DbException(), null];
    }
  }
}
