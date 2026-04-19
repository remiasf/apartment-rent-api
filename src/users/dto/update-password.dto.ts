import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordDto {
    @ApiProperty({
        description: 'Old password'
    })
    @IsString()
    @IsNotEmpty({message:'The old password can`t be empty'})
    oldPassword!: string

    @ApiProperty({
        description: 'New password',
        minLength: 6,
        maxLength: 28
    })
    @IsString()
    @MinLength(6, {message: 'Your password can`t be shorter than 6 characters'})
    @MaxLength(28, {message: 'Your password is too long'})
    newPassword!: string
}