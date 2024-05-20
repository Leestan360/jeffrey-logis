import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.check.service';

@Controller({ path: '/health', version: '1' })
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  healthCheck() {
    return this.healthService.healthCheck();
  }
}
