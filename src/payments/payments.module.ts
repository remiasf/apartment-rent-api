import { Module } from '@nestjs/common';
import { LiqPayService } from './liqpay/liqpay.service';
import { PaymentsController } from './payments.controller';

@Module({
  providers: [LiqPayService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
