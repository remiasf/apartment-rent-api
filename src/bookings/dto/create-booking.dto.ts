import { Booking, BookingStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateBookingDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    apartmentId: number

    @IsNotEmpty()
    @Type(()=> Date)
    @IsDate()
    startDate: Date
    
    @IsNotEmpty()
    @Type(()=> Date)
    @IsDate()
    endDate: Date
}
