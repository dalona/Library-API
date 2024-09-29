// import { PartialType } from '@nestjs/mapped-types';
// import { CreateBookDto } from './create-book.dto';

// export class UpdateBookDto extends PartialType(CreateBookDto) {}

import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsDateString()
  @IsOptional()
  publishedDate?: string
}

