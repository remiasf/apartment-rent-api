import { IsNumber, IsOptional, IsPositive, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

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

    @ApiProperty({description: 'page number', required: false})
    @IsString()
    @IsOptional()
    page?:string
}