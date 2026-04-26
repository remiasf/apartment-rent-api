import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LiqPayService {

    constructor(private prisma: PrismaService){}

    private readonly publicKey = process.env.LIQPAY_PUBLIC_KEY;
    private readonly privateKey = process.env.LIQPAY_PRIVATE_KEY;

    async generatePaymentParams(bookingId: number){
        const bookingInfo = await this.prisma.booking.findUnique({
            where: {id: bookingId},
            select: {totalPrice: true}
        });

        if(!bookingInfo){
            throw new NotFoundException(`Booking ${bookingId} not found`);
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        const dynamicResultUrl = `${frontendUrl}/bookings/${bookingId}`

        const params = {
            public_key: this.publicKey,
            version: 3,
            action: 'pay',
            amount: bookingInfo.totalPrice,
            currency: 'UAH',
            description: `Apartment payment (Booking #${bookingId})`,
            order_id: `booking_${bookingId}_${Date.now()}`,
            server_url: process.env.LIQPAY_WEBHOOK_URL,
            result_url: dynamicResultUrl,
        }
        const jsonString = JSON.stringify(params);
        const data = Buffer.from(jsonString).toString('base64');

        const signString = this.privateKey + data + this.privateKey;
        const signature = crypto.createHash('sha1').update(signString).digest('base64');

        return {
            data,
            signature
        };
    }

    verifySignature(data: string, incomingSignature: string): boolean {
        const signString = this.privateKey + data + this.privateKey;
        const expectedSignature = crypto.createHash('sha1').update(signString).digest('base64');

        return incomingSignature === expectedSignature;
    }
}
