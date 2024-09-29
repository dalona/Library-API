import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateBookDto {
    
    @IsString()
    @IsNotEmpty({ message: 'The title must not be empty' })
    title: string;

    @IsString()
    @IsOptional()
    author: string

    @IsDateString()
    @IsOptional()
    publishedDate?: string

    @IsString()
    genre: string
}
