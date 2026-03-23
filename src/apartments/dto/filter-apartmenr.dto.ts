import { IsNumber, IsOptional, IsPositive, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class FilterApartmentDto {
    
    
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    minPrice?: number;

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    maxPrice?: number;

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    minSize?: number;

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    maxSize?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(20)
    rooms?: number
}