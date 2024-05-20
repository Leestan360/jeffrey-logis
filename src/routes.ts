import { Routes } from '@nestjs/core';
import { UserModule } from './user/user.module';

export const routes: Routes = [
  {
    path: '/users',
    module: UserModule,
  },
];
