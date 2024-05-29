import { Controller, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Lipa  na Mpesa')
@Controller()
export class PaymentController {
  private readonly logger = new Logger(PaymentService.name);
  constructor(private readonly paymentService: PaymentService) {}
}
