import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/common/enums/role.enum";

import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity("guests")
export class Guest {
    @ApiProperty({
        example: '1',
        description: 'Unique identifier type number: Guest ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar',{
        length: 150,
        nullable: false,
        name: 'role', default:'user'}) 

        role: Role;

    @ApiProperty({
        example: 'Pepito Perez',
        description: 'First name and last name',
        uniqueItems:true
    })
    @Column('varchar',{
        length: 150,
        nullable: false,
        name: 'name'})
    name: string;

    @ApiProperty({
        example: 'pepitoperez@correo.com',
        description: 'e-mail address',
        uniqueItems:true
    })
    @Column('varchar',{
        unique: true,
        length: 150,
        nullable: false,
        name: 'email'})
    email: string;

    @ApiProperty({
        example: 'Qwer1234*',
        description: 'The password must contain uppercase, lowercase, numeric and special characters.',
        uniqueItems:true
    })
    @Column('varchar', { 
        length: 105, 
        select: false, 
        nullable: false })
    password: string;
    
    @ApiProperty({        
        description: 'Date of user registration. Automatic date.',
        uniqueItems:true
    })
    @CreateDateColumn({ type: 'timestamp' })
    registrationDate: Date;

    @ApiProperty({
        description: 'Date of last update.',
        uniqueItems:true
    })
    @UpdateDateColumn({ type: 'timestamp' })
    lastUpdateDate: Date;



}
