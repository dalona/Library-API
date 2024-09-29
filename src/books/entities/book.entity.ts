import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('books')
export class Book {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 150, nullable: false })
    title: string;

    @Column({ type: 'varchar', length: 150, default: 'unknown' })
    author: string;

    @Column({ type: 'date' })
    publishedDate: Date;

    @Column({ type: 'varchar', length: 50 })
    genre: string
}
