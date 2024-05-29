import {
  Controller,
  Post,
  Body,
  Logger,
  Get,
  Query,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './models/dto/create-user.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserResponseDto } from './models/dto/create-user-response.dto';
import { UserResponseDto } from './models/dto/user-response.dto';
import { UpdateUserDto } from './models/dto/update-user.dto';
import { DeleteUserResponseDto } from './models/dto/delete-user-response.dto';
import { UserAuthGuard } from './auth/user-auth.guard';
import { Public } from './auth/is-public.decorator';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { RoleEnum } from './models/user.enum';
import { RequestPaymentDto } from '../payment/models/dto/request-payment.dto';

@ApiTags('User')
@UseGuards(UserAuthGuard, RolesGuard)
@Controller()
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  // Create a new user
  @ApiOkResponse({
    type: () => CreateUserResponseDto,
  })
  @ApiOperation({ summary: 'Create new user' })
  @Public()
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    this.logger.log(
      `Controller [createUser] create new user with name: ${createUserDto.firstName} ${createUserDto.lastName}`,
    );
    const [ex, newUser] = await this.userService.createUser(createUserDto);
    if (ex) {
      this.logger.error('Controller [createUser] create new user failed', ex);
      throw ex;
    }
    return newUser;
  }

  // Get a user by id
  @ApiOkResponse({
    type: () => UserResponseDto,
  })
  @ApiOperation({ summary: 'Get user by ID' })
  @Get('/:id')
  @ApiQuery({
    name: 'id',
    description: 'The ID of the user to be read',
    type: String,
    required: true,
  })
  async getUserById(@Query('id') id: string): Promise<UserResponseDto> {
    this.logger.log(`Controller [getUserById] get user with id: ${id}`);
    const [ex, foundUser] = await this.userService.getUserById(id);
    if (ex) {
      this.logger.error('Controller [getUserById] get user failed', ex);
      throw ex;
    }
    return foundUser;
  }

  // Update a user
  @ApiOkResponse({
    type: () => UserResponseDto,
  })
  @ApiOperation({ summary: 'Update user' })
  @Patch('/:id')
  @ApiQuery({
    name: 'id',
    description: 'The ID of the user to be updated',
    type: String,
    required: true,
  })
  async updateUser(
    @Query('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.logger.log(`Controller [updateUser] update user with id: ${id}`);
    const [ex, updatedUser] = await this.userService.updateUser(
      { id: id },
      updateUserDto,
    );
    if (ex) {
      this.logger.error('Controller [updateUser] update user failed', ex);
      throw ex;
    }
    return updatedUser;
  }

  // Get users
  @ApiOkResponse({
    type: () => UserResponseDto,
  })
  @ApiOperation({ summary: 'Get users' })
  @Get()
  @Roles(RoleEnum.ADMIN)
  async getUsers(): Promise<UserResponseDto[]> {
    this.logger.log(`Controller [getUsers] get users`);
    const [ex, users] = await this.userService.getUsers();
    if (ex) {
      this.logger.error('Controller [getUsers] get users failed', ex);
      throw ex;
    }
    return users;
  }

  // Soft delete user
  @ApiOkResponse({
    type: () => DeleteUserResponseDto,
  })
  @ApiOperation({ summary: 'Soft delete a user' })
  @Delete('/:id')
  @ApiQuery({
    name: 'id',
    description: 'The ID of the user to be soft deleted',
    type: String,
    required: true,
  })
  async softDeleteUserById(@Query('id') id: string): Promise<number> {
    this.logger.log(
      `Controller [softDeleteUserById] soft delete user with id: ${id}`,
    );
    const [ex, deletedUser] = await this.userService.sofDeleteUserById(id);
    if (ex) {
      this.logger.error(
        'Controller [softDeleteUserById] soft delete user failed',
        ex,
      );
      throw ex;
    }
    return deletedUser;
  }

  // Lipa na mpesa
  @Public()
  @Post('lipa-na-mpesa')
  async lipaNaMpesaOnline(
    @Body() requestData: RequestPaymentDto,
  ): Promise<any> {
    try {
      this.logger.log(
        `Controller [lipaNaMpesaOnline] make payment request with phone number: ${requestData.phoneNumber} and amount: ${requestData.amount}`,
      );
      const result = await this.userService.lipaNaMpesaOnline(requestData);
      return result.data;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to process Lipa Na M-Pesa payment');
    }
  }
}
