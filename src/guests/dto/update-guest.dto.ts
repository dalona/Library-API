import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateGuestDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    @IsEmail({}, { message: 'Please enter a valid email adress' })
    email?: string;

    @IsString()
    @IsOptional()
    @MinLength(8, { message: 'Password must have at least 8 characters'})
    password?: string;
}