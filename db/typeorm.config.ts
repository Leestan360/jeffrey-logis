import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { envKeys } from '../src/config/config.keys';

//using this because this is outside the scope of the project
config();

const configService = new ConfigService();

export default new DataSource({
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  type: configService.get<string>(envKeys.DB_TYPE) as 'postgres',
  host: configService.get<string>(envKeys.DB_HOST),
  port: configService.get<number>(envKeys.DB_PORT) as number,
  username: configService.get<string>(envKeys.DB_USERNAME),
  password: configService.get<string>(envKeys.DB_PASSWORD),
  database: configService.get<string>(envKeys.DB_DATABASE),
  synchronize: false,
  logging:
    configService.get<string>(envKeys.CURRENT_ENV) === 'DEV' ? true : false,
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
  // ssl: false,
  ssl: {
    rejectUnauthorized: configService.get<boolean>(
      envKeys.DATABASE_SSL_REJECT_UNAUTHORIZED,
      false,
    ),
  },
});
