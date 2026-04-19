import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, Max, Min } from "class-validator";

export class DiscountApartmentDto {
    @ApiProperty({
            description: 'Appy a discount to any apartment you own',
            minimum: 1,
            maximum: 50,
            example: 10  
        })
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(50)
    discountPercentage!: number;
}