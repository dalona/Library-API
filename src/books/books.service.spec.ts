/*
Configuración de Pruebas Unitarias
Crear el archivo de pruebas: Crea un archivo llamado books.service.spec.ts en el mismo directorio que tu servicio books.service.ts.

Mockear el repositorio de TypeORM: Utilizaremos mocks para simular el comportamiento del repositorio de TypeORM. */


import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { create } from 'domain';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>

  const mockBookRepository = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
    findAndCount: jest.fn()
  });

  const mockBooks = [
    { id: 1, title: 'Book 1', author: 'Author 1', genre: 'Genre 1', publishedDate: 'YYYY-MM-DD' },
    { id: 2, title: 'Book 2', author: 'Author 2', genre: 'Genre 1', publishedDate: 'YYYY-MM-DD' },
  ];

  it('it should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBook', () => {
    it('debería crear un libro correctamente', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        author: 'New Author',
        genre: 'New Genre',
        publishedDate: 'YYYY-MM-DD',
      };

      // Simular que no existe un libro con el mismo título
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      // Simular que ya existen libros en el sistema
      (repository.find as jest.Mock).mockResolvedValue(mockBooks);

      // Simular la creación y guardado del libro
      (repository.create as jest.Mock).mockReturnValue(createBookDto);
      (repository.save as jest.Mock).mockResolvedValue({ id: 3, ...createBookDto });

      const result = await service.createBook(createBookDto);


      expect(repository.findOne).toHaveBeenCalledWith({ where: { title: createBookDto.title, id: undefined } });
      expect(repository.find).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalledWith(createBookDto);
      expect(repository.save).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual({
        message: `-Book- "New Book" with ID "3" has been created`,
        book: { id: 3, ...createBookDto },
      });
    });

    it('debería lanzar ConflictException si el título ya existe', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Existing Book',
        author: 'Author',
        genre: 'Genre',
        publishedDate: 'YYYY-MM-DD',
      };

      // Simular que ya existe un libro con el mismo título
      (repository.findOne as jest.Mock).mockResolvedValue({ id: 1, ...createBookDto });

      await expect(service.createBook(createBookDto)).rejects.toThrow(ConflictException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { title: createBookDto.title, id: undefined } });
    });

    it('debería lanzar NotFoundException si no hay libros en el sistema', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        author: 'Author',
        genre: 'Genre',
        publishedDate: 'YYYY-MM-DD',
      };

      // Simular que no existe un libro con el mismo título
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      // Simular que no hay libros en el sistema
      (repository.find as jest.Mock).mockResolvedValue([]);

      await expect(service.createBook(createBookDto)).rejects.toThrow(NotFoundException);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar un libro por ID', async () => {
      const bookId = 1;
      const book = mockBooks[0];

      (repository.findOne as jest.Mock).mockResolvedValue(book);

      const result = await service.findOne(bookId);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: bookId } });
      expect(result).toEqual(book);
    });

    it('debería lanzar NotFoundException si el libro no existe', async () => {
      const bookId = 999;

      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(bookId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: bookId } });
    });
  });

  describe('update', () => {
    it('debería actualizar un libro correctamente', async () => {
      const bookId = 1;
      const updateBookDto: UpdateBookDto = { title: 'Updated Title' };
      const existingBook = { id: bookId, title: 'Old Title', author: 'Author', genre: 'Genre', publishedDate: 'YYYY-MM-DD' };
      const updatedBook = { ...existingBook, ...updateBookDto };

      (repository.findOne as jest.Mock).mockResolvedValue(existingBook);
      (repository.findOne as jest.Mock).mockResolvedValueOnce(existingBook); // Para verificar el título
      (repository.save as jest.Mock).mockResolvedValue(updatedBook);

      const result = await service.update(bookId, updateBookDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: bookId } });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { title: updateBookDto.title, id: expect.anything() } });
      expect(repository.save).toHaveBeenCalledWith(updatedBook);
      expect(result).toEqual(updatedBook);
    });

    it('debería lanzar NotFoundException si el libro no existe', async () => {
      const bookId = 999;
      const updateBookDto: UpdateBookDto = { title: 'Updated Title' };

      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update(bookId, updateBookDto)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: bookId } });
    });

    it('debería lanzar ConflictException si el nuevo título ya existe', async () => {
      const bookId = 1;
      const updateBookDto: UpdateBookDto = { title: 'Existing Title' };
      const existingBook = { id: bookId, title: 'Old Title', author: 'Author', genre: 'Genre', publishedDate: new Date() };
      const conflictingBook = { id: 2, title: 'Existing Title', author: 'Author', genre: 'Genre', publishedDate: new Date() };

      (repository.findOne as jest.Mock)
        .mockResolvedValueOnce(existingBook) // Encontrar el libro a actualizar
        .mockResolvedValueOnce(conflictingBook); // Encontrar el conflicto de título

      await expect(service.update(bookId, updateBookDto)).rejects.toThrow(ConflictException);
      expect(repository.findOne).toHaveBeenNthCalledWith(1, { where: { id: bookId } });
      expect(repository.findOne).toHaveBeenNthCalledWith(2, { where: { title: updateBookDto.title, id: expect.anything() } });
    });
  });

  describe('remove', () => {
    it('debería eliminar un libro correctamente', async () => {
      const bookId = 1;
      const existingBook = { id: bookId, title: 'Book to Delete', author: 'Author', genre: 'Genre', publishedDate: new Date() };

      (repository.findOne as jest.Mock).mockResolvedValue(existingBook);
      (repository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await expect(service.remove(bookId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: bookId } });
      expect(repository.delete).toHaveBeenCalledWith(bookId);
    });

    it('debería lanzar NotFoundException si el libro no existe', async () => {
      const bookId = 999;

      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(bookId)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: bookId } });
    });
  })

})