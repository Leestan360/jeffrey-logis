import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import databaseConfig from './config/database.config';
import { routes } from './routes';
import { DatabaseModule } from './database/database.module';
import { DefaultModule } from './default/default.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    RouterModule.register(routes),
    DatabaseModule,
    DefaultModule,
    SharedModule,
    UserModule,
  ],
})
export class AppModule {}
