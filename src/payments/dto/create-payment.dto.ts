import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreatePaymentDto{
    @ApiProperty({
        description: 'Unique booking id',
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    bookingId: number;
}