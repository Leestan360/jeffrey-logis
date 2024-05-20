import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  healthCheck = () => ({
    ok: true,
    message: 'Healthy',
  });
}
