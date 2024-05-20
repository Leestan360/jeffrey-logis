import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envKeys } from '../config/config.keys';
import { UserEntity } from '../user/models/entities/user.entity';

const entities = [UserEntity];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('database.type') as 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities,
        synchronize: false,
        logging:
          configService.get<string>(envKeys.CURRENT_ENV) === 'DEV'
            ? true
            : false,
        migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
        migrationsTableName: 'migrations',
        // ssl: false,
        ssl: {
          rejectUnauthorized: configService.get<boolean>(
            'database.sslRejectUnauthorized',
            false,
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
