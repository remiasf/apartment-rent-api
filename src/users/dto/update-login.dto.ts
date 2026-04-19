import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateLoginDto {
    @ApiProperty({
        example: 'user777',
        minLength: 3,
        maxLength: 20
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3, {message: 'Your login can`t be shorter than 3 characters'})
    @MaxLength(20, {message: 'Your login is too long'})
    @IsAlphanumeric()
    login: string;
}