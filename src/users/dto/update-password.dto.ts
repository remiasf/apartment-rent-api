import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty({message:'The old password can`t be empty'})
    oldPassword: string

    @IsString()
    @MinLength(6, {message: 'Your password can`t be shorter than 6 characters'})
    @MaxLength(28, {message: 'Your password is too long'})
    newPassword: string
}