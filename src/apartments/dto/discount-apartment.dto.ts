import { IsNumber, IsPositive, Max, Min } from "class-validator";

export class DiscountApartmentDto {
    @IsNumber()
    @IsPositive()
    @Min(0)
    @Max(99)
    discountPercentage: number;
}