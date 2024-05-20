import { Module } from '@nestjs/common';
import { HealthController } from './health/health.check.contoroller';
import { HealthService } from './health/health.check.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class DefaultModule {}
