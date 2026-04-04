import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateInfoDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3, {message: 'Your name should include at least 3 characters'})
    @MaxLength(40, {message: 'Your name is too long'})
    name: string;

    @IsString()
    @IsOptional()
    @MinLength(20, {message: 'Bio minimum length is 20 characters'})
    @MaxLength(200, {message: 'Bio can`t be more than 200 characters'})
    bio?: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    avatarUrl?: string
}