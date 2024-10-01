// books.service.integration.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('BooksService Integration', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // Configuración de TypeORM para pruebas
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Book],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([Book]),
      ],
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  afterEach(async () => {
    // Limpiar la base de datos después de cada prueba
    await repository.query('DELETE FROM book');
  });

  afterAll(async () => {
    await repository.manager.connection.close();
  });

  it('debería crear un libro correctamente', async () => {
    const createBookDto: CreateBookDto = {
      title: 'Integration Book',
      author: 'Integration Author',
      genre: 'Integration Genre',
      publishedDate: 'YYYY-MM-DD',
    };

    // Primero, insertar un libro para asegurar que existan libros en el sistema
    await repository.save({
      title: 'Existing Book',
      author: 'Author',
      genre: 'Genre',
      publishedDate: 'YYYY-MM-DD',
    });

    const result = await service.createBook(createBookDto);

    expect(result).toHaveProperty('message', `-Book- "Integration Book" with ID "2" has been created`);
    expect(result.book).toHaveProperty('id');
    expect(result.book.title).toBe(createBookDto.title);
  });

  it('debería lanzar ConflictException al crear un libro con título existente', async () => {
    const createBookDto: CreateBookDto = {
      title: 'Existing Book',
      author: 'Author',
      genre: 'Genre',
      publishedDate: 'YYYY-MM-DD',
    };

    // Insertar un libro con el título existente
    await repository.save(createBookDto);

    // Intentar crear otro libro con el mismo título
    await expect(service.createBook(createBookDto)).rejects.toThrow(ConflictException);
  });

  it('debería lanzar NotFoundException al crear un libro cuando no hay libros en el sistema', async () => {
    const createBookDto: CreateBookDto = {
      title: 'New Book',
      author: 'Author',
      genre: 'Genre',
      publishedDate: 'YYYY-MM-DD',
    };

    // No insertar ningún libro en el sistema

    await expect(service.createBook(createBookDto)).rejects.toThrow(NotFoundException);
  });

  it('debería encontrar un libro por ID', async () => {
    const book = await repository.save({
      title: 'Find Book',
      author: 'Author',
      genre: 'Genre',
      publishedDate: 'YYYY-MM-DD',
    });

    const foundBook = await service.findOne(book.id);

    expect(foundBook).toHaveProperty('id', book.id);
    expect(foundBook.title).toBe('Find Book');
  });

  it('debería lanzar NotFoundException al buscar un libro inexistente', async () => {
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  // Puedes agregar más pruebas para otros métodos como update, remove, searchBooks y findAllBooks
});
