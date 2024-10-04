import { Module } from '@nestjs/common';

import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BooksService } from './books.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]),AuthModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports:[BooksService]
})
export class BooksModule {}
