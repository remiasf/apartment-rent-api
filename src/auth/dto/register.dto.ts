import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, {message: 'Your name should include at least 3 characters'})
    @MaxLength(40, {message: 'Your name is too long'})
    name: string;

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