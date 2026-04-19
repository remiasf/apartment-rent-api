import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateInfoDto {
    @ApiPropertyOptional({
        example: 'Brad Pitt',
        minLength: 3,
        maxLength: 40
    })
    @IsString()
    @IsOptional()
    @MinLength(3, {message: 'Your name should include at least 3 characters'})
    @MaxLength(40, {message: 'Your name is too long'})
    name?: string;
    
    @ApiPropertyOptional({
        example: 'Hello world, my name is Brad Pitt',
        minLength: 20,
        maxLength: 200
    })
    @IsString()
    @IsOptional()
    @MinLength(20, {message: 'Bio minimum length is 20 characters'})
    @MaxLength(200, {message: 'Bio can`t be more than 200 characters'})
    bio?: string;

    @ApiPropertyOptional({

    })
    @IsString()
    @IsOptional()
    @IsUrl()
    avatarUrl?: string
}