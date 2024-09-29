import { Book } from "../entities/book.entity";

export interface CreateBookResponse {
    message: string;
    book: Book;
  }
  