import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, QueryBuilder, Repository } from 'typeorm';
import { SearchBooksDto } from './dto/search-book.dto';
import { CreateBookResponse } from './interfaces/create-book-response';
import { title } from 'process';

@Injectable()
export class BooksService {

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>
  ) {}


  // async createBook(createBookDto: CreateBookDto): Promise<Book> {
  //   // Verify if a book already exist with the same the title
  //   const existingBook = await this.bookRepository.findOne({ where: { title: createBookDto.title } });
    
  //   if (existingBook) {
  //     throw new ConflictException('A book with that title already exists.');
  //   }

  //   const allbooks = await this.bookRepository.find();
  //   if(allbooks.length === 0){
  //     throw new NotFoundException('No books found in the system');
  //   }

  //   const book = this.bookRepository.create(createBookDto);
  //   return this.bookRepository.save(book);
  // }

  async createBook(createBookDto: CreateBookDto): Promise<CreateBookResponse> {
    // Verificar si ya existe un libro con el mismo título
    await this.verifyBookTitleExists(createBookDto.title);
  
    // Verificar si ya existen libros en el sistema
    await this.ensureBooksExist();
  
    // Crear y guardar el nuevo libro
    const book = this.bookRepository.create(createBookDto);
    const savedBook = await this.bookRepository.save(book);
return {
  message: `-Book- "${savedBook.title}" with ID "${savedBook.id}" has been created`,
  book: savedBook,
};

}
  
  // Función que verifica si un libro con el mismo título ya existe (modificado para tomar en cuenta el ID)
  private async verifyBookTitleExists(title: string, excludeId?: number): Promise<void> {
    const existingBook = await this.bookRepository.findOne({ where: { title, id: Not(excludeId) } });
    if (existingBook) {
      throw new ConflictException('A book with that title already exists.');
    }
  }
  
  // Función que verifica si hay libros en el sistema
  private async ensureBooksExist(): Promise<void> {
    const allbooks = await this.bookRepository.find();
    if (allbooks.length === 0) {
      throw new NotFoundException('No books found in the system');
    }
  }
  

  async searchBooks(searchBooksDto: SearchBooksDto, page: number = 1, limit: number = 10): Promise< {data:Book[]; total: number; page: number; limit: number}> {
    const {title, author, genre, publishedDate } = searchBooksDto;

    

    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    if (title) {
      queryBuilder.andWhere('LOWER(book.title) LIKE LOWER(:title)', { title: `%${title}%` });
    }

    if (author) {
      queryBuilder.andWhere('LOWER(book.author) LIKE LOWER(:author)', { author: `%${author}%` });
    }

    if (genre) {
      queryBuilder.andWhere('LOWER(book.genre) LIKE LOWER(:genre)', { genre: `%${genre}%` });
    }

    if (publishedDate) {
      // Convertimos el publishedDate a un objeto Date

      queryBuilder.andWhere('book.publishedDate = :publishedDate', { publishedDate });
    }

  //   const books = await queryBuilder.getMany();

  //   if (books.length === 0) {
  //     throw new NotFoundException('No books found with the given info');
  //   }

  //   return books;
  // }
  const [books, total] = await queryBuilder
    .skip((page - 1) * limit) // Paginación
    .take(limit)
    .getManyAndCount();

  if (books.length === 0) {
    throw new NotFoundException('No books found with the given info');
  }

  return {
    data: books,
    total,
    page,
    limit,
  };
}

/*skip: Define cuántos registros saltar en función de la página actual.
take: Define cuántos registros tomar por página.
findAndCount y getManyAndCount: Estos métodos devuelven un array donde el primer elemento es el resultado paginado y el segundo es el número total de registros.
Resultado: La respuesta incluye la lista de libros paginada (data), el número total de libros (total), la página actual (page), y el número de libros por página (limit).*/


  // async findAllBooks(): Promise<Book[]> {
  //   try{
  //     return await this.bookRepository.find();
  //   }catch(error){
  //     throw new NotFoundException('Failed to get books');
  //   }
  // }

  async findAllBooks(page: number = 1, limit: number = 10): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    try {
      const [result, total] = await this.bookRepository.findAndCount({
        skip: (page - 1) * limit, // Saltar libros según la página
        take: limit, // Limitar el número de libros devueltos
      });
  
      return {
        data: result,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new NotFoundException('Failed to get books');
    }
  }
  

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }

    return book;
  }


  
  async update(id: number, updateBookDto: UpdateBookDto):Promise<Book> {
    
      const book = await this.bookRepository.findOne({ where: { id } });

      if (!book) {
        throw new NotFoundException(`Book with ID "${id}" not found`);
      }

      // Si hay un título nuevo, verifica que no exista otro libro con ese título
      if(updateBookDto.title){
        await this.verifyBookTitleExists(updateBookDto.title,id);
      }

      // Actualiza las propiedades del libro
      Object.assign(book, updateBookDto);

      return this.bookRepository.save(book);

    }   
      
    
  


    async remove(id: number): Promise<void> {
      const book = await this.bookRepository.findOne({ where: { id } });
  
      if (!book) {
        throw new NotFoundException(`Book with ID "${id}" not found`);
      }
      else{
        await this.bookRepository.delete(id); 
          throw new NotFoundException(`Book with ID "${id}" has been succesfully deleted`);
      }
      
    }



}

