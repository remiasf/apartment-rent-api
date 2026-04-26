import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LiqPayService } from './liqpay/liqpay.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly liqpayService: LiqPayService){}

    @Post('generate')
    generatePayment(@Body() dto: CreatePaymentDto){
        return this.liqpayService.generatePaymentParams(dto.bookingId);
    }

    @Post('callback')
    @HttpCode(HttpStatus.OK)
    handleCallBack(@Body() body: { data: string; signature: string}){
        console.log('--- LiqPay WebHook ---');

        const isValid = this.liqpayService.verifySignature(body.data, body.signature);
        
        if(!isValid){
            console.error('Safety error: invalid signature!');
            return {
                status: 'error',
                message: 'Invalid signature'
            }
        }

        const decodedString = Buffer.from(body.data, 'base64').toString('utf-8');
        const paymentData = JSON.parse(decodedString);

        console.log(`Payment data: ${paymentData.order_id} status: ${paymentData.status}`);

        if(paymentData.status === 'success' || paymentData.status === 'sandbox'){
            console.log(`Booking ${paymentData.order_id} payed successfully`);
        }

        return {status: 'success'};
    }
}
