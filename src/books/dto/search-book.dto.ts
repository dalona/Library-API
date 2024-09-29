import { IsDate, IsDateString, IsOptional, IsString } from 'class-validator';

export class SearchBooksDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    author?: string

    @IsString()
    @IsOptional()
    genre?: string

    @IsDateString()
    @IsOptional()
    publishedDate?: string
}
