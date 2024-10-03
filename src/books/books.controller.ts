import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { SearchBooksDto } from './dto/search-book.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/enums/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('books')
export class BooksController {

  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Guest)
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.createBook(createBookDto);
  }

  @Get()
  async findAll(): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    return await this.booksService.findAllBooks();
  }
  
  //Los filtros solo se aplican si se usa 'search' en el endpoint porque asi puse la logica en searchBooks
  @Get('search')
  async searchBooks(@Query() searchBooksDto: SearchBooksDto): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    return await this.booksService.searchBooks(searchBooksDto);
  }
  
  /*/books?author=John Doe&genre=Science Fiction
  books?fromDate=2022-01-01&toDate=2023-01-01
  books?author=Jane Austen&fromDate=1800-01-01&toDate=1817-01-01*/



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
   async update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
   await this.booksService.remove(+id);
  }
}
