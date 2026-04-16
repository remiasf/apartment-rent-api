import { IsAlphanumeric, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export enum RegistrationRole {
  USER = 'USER',
  LANDLORD = 'LANDLORD'
}

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
    @IsAlphanumeric()
    login: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    @MinLength(20, {message: 'Bio minimum length is 20 characters'})
    @MaxLength(200, {message: 'Bio can`t be more than 200 characters'})
    bio?: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    avatarUrl?: string

    @IsString()
    @MinLength(6, {message: 'Your password can`t be shorter than 6 characters'})
    @MaxLength(28, {message: 'Your password is too long'})
    password: string;

    @IsOptional()
    @IsEnum(RegistrationRole, {message: 'You only can choose USER or LANDLORD role'})
    role?: RegistrationRole;
}