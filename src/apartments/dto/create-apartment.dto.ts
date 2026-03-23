import { IsString, IsPositive, MinLength, MaxLength, IsNumber, Min, Max, IsOptional, } from "class-validator";

export class CreateApartmentDto {
    @IsString()
    @MinLength(5)
    @MaxLength(26)
    title: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    discountPrice?: number;

    @IsNumber()
    @IsPositive()
    @Min(10000)
    @Max(10000000)
    price: number;

    @IsNumber()
    @IsPositive()
    size: number

    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(12)
    rooms: number;
}
