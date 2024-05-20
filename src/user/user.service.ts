import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './models/dto/create-user.dto';
import { UserRepository } from './user.repository';
import { ErrorResultTuple } from 'src/shared/error/error-result-tuple';
import { CreateUserResponseDto } from './models/dto/create-user-response.dto';
import * as bcrypt from 'bcrypt';
import { RecordInvalidException } from '../shared/error/exceptions/record-invalid-exception';
import { UserResponseDto } from './models/dto/user-response.dto';
import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { UserEntity } from './models/entities/user.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UserResponseWithPassDto } from './models/dto/user-response-with-pass.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  // Create a new user
  async createUser(
    data: CreateUserDto,
  ): Promise<ErrorResultTuple<CreateUserResponseDto>> {
    this.logger.log(
      `Service [createUser] save user with name ${data.firstName} ${data.lastName}`,
    );
    // Format the phoneNumber
    const formattedPhoneNumber = this.formatPhoneNumber(data.phoneNumber);

    // Hash the password
    const saltOrRounds = 10;
    const hashedPass = await bcrypt.hash(data.password, saltOrRounds);

    const userData = {
      ...data,
      phoneNumber: formattedPhoneNumber,
      password: hashedPass,
    };
    return await this.userRepository.createUser(userData);
  }

  // Get a user by ID
  async getUserById(id: string): Promise<ErrorResultTuple<UserResponseDto>> {
    this.logger.log(`Service [getUserById] get user with id ${id}`);
    const userOptions: FindOneOptions<UserEntity> = {
      where: { id: id },
    };
    return await this.userRepository.findUserByField(userOptions);
  }

  // Get a user by email
  async getUserByEmail(
    email: string,
  ): Promise<ErrorResultTuple<UserResponseWithPassDto>> {
    this.logger.log(`Service [getUserByEmail] get user with email ${email}`);
    const userOptions: FindOneOptions<UserEntity> = {
      where: { email: email },
    };
    return await this.userRepository.findUserByField(userOptions);
  }

  // update a user
  async updateUser(
    options: FindOptionsWhere<UserEntity>,
    partialEntity: QueryDeepPartialEntity<UserEntity>,
  ) {
    this.logger.log('Service [updateUser] update user');
    return await this.userRepository.updateUser(options, partialEntity);
  }

  // Get all users
  async getUsers(): Promise<ErrorResultTuple<UserResponseDto[]>> {
    this.logger.log('Service [getUsers] get users');
    const userOptions: FindManyOptions<UserEntity> = {
      relations: [],
    };
    return await this.userRepository.getUsers(userOptions);
  }

  // Delete a user
  async sofDeleteUserById(id: string): Promise<ErrorResultTuple<number>> {
    this.logger.log(
      `Service [softDeleteUserByField] soft delete user with id ${id}`,
    );
    const deleteOptions: FindOptionsWhere<UserEntity> = {
      id: id,
    };
    return await this.userRepository.softDeleteUserByField(deleteOptions);
  }

  // Format phone number
  private formatPhoneNumber(phoneNumber: string): string {
    if (phoneNumber.startsWith('0')) {
      return `+254${phoneNumber.slice(1)}`;
    } else if (phoneNumber.startsWith('254')) {
      return `+${phoneNumber}`;
    } else if (phoneNumber.startsWith('+254')) {
      return phoneNumber;
    } else {
      const errorMessage = `Phone number: ${phoneNumber}`;
      const clientStatusCode = 'RGX422';
      throw new RecordInvalidException(errorMessage, clientStatusCode);
    }
  }
}
