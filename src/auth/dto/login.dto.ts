import { MinLength, IsString, IsNotEmpty, MaxLength } from "class-validator";

export class LoginDto{
    @IsString()
    @IsNotEmpty()
    @MinLength(3, {message: 'Your login can`t be shorter than 3 characters'})
    @MaxLength(20, {message: 'Your login is too long'})
    login: string;

    @IsString()
    @MinLength(6, {message: 'Your password can`t be shorter than 6 characters'})
    @MaxLength(28, {message: 'Your password is too long'})
    password: string;   
}