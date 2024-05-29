// user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/entities/user.entity';
import { UserRepository } from './user.repository';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envKeys } from '../config/config.keys';
import { UserAuthGuard } from './auth/user-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>(envKeys.JWT_SECRET),
        signOptions: { expiresIn: '60000s' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    PaymentModule,
  ],
  controllers: [UserController, AuthController],
  providers: [
    UserRepository,
    UserService,
    AuthService,
    UserAuthGuard,
    RolesGuard,
  ],
  exports: [UserService, AuthService, UserAuthGuard, RolesGuard],
})
export class UserModule {}
