import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/base.repository';
import { UserEntity } from './models/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { CreateUserDto } from './models/dto/create-user.dto';
import { ErrorResultTuple } from '../shared/error/error-result-tuple';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    super(userRepo);
  }

  // Create a new user
  async createUser(data: CreateUserDto): Promise<ErrorResultTuple<UserEntity>> {
    this.logger.log(
      `Repo [createUser] with name ${data.firstName} ${data.lastName}`,
    );
    return await this.save(data);
  }

  // Find user by id
  async findUserByField(
    options?: FindOneOptions<UserEntity>,
  ): Promise<ErrorResultTuple<UserEntity>> {
    this.logger.log(`Repo [findUserById] find user by id`);
    return await this.findOneByField(options);
  }

  // Update a user
  async updateUser(
    options: FindOptionsWhere<UserEntity>,
    partialEntity: QueryDeepPartialEntity<UserEntity>,
  ) {
    this.logger.log(`Repo [updateUser] update user`);
    return await this.updateByField(options, partialEntity);
  }

  // Get users
  async getUsers(
    options?: FindManyOptions<UserEntity>,
  ): Promise<ErrorResultTuple<UserEntity[]>> {
    this.logger.log(`Repo [getUsers] get users`);
    return await this.findAll(options);
  }

  // Delete user by field
  async softDeleteUserByField(
    options: FindOptionsWhere<UserEntity>,
  ): Promise<ErrorResultTuple<number>> {
    this.logger.log(`Repo [softDeleteUserByField] delete user by id`);
    return await this.softDeleteByField(options);
  }
}
