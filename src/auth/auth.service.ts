import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

import { loginUserDto } from './dto/login.dto';
import { Guest } from '../guests/entities/guest.entity';


@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(Guest) private readonly guestRepository:Repository<Guest>,
        private readonly jwtService:JwtService,
    ){}



    // async login(loginDto:loginUserDto){
    //     const {password, email} = loginDto

    //     console.error('Trying to log in with email:', email);


    //     const guest = await this.guestRepository.createQueryBuilder("guest").leftJoinAndSelect("guest.role", "role").where("guest.email = :email", { email }).select(["guest.name", "guest.email", "guest.password", "role.name"]).getOne();
    //     if(!guest || !bcrypt.compareSync(password, guest.password))
    //         throw new UnauthorizedException('Credentials are not valid')
    //     return {
    //         name: guest.name,
    //         email: guest.email,
    //         role: guest.role,
    //         token:this.getJwtToken({email: guest.email})
    //     }
    // }

    // private getJwtToken(payload:JwtPayload){
    //     const token = this.jwtService.sign(payload);
    //     return token
    // }

    async login(loginDto: loginUserDto) {
        const { password, email } = loginDto;
    
        // Log para ver las credenciales proporcionadas
        console.error('Trying to log in with email:', email);
    
        const guest = await this.guestRepository.createQueryBuilder("guest")
            //.leftJoinAndSelect("guest.role", "role")
            .where("guest.email = :email", { email })
            .select(["guest.name", "guest.email", "guest.password", "guest.role"])
            .getOne();
    
        // Log para ver si el usuario fue encontrado
        if (!guest) {
            console.error('User not found with email:', email);
            throw new UnauthorizedException('Credentials are not valid');
        }
    
        // Log para ver si la contraseña coincide
        if (!bcrypt.compareSync(password, guest.password)) {
            console.error('Invalid password for user:', email);
            throw new UnauthorizedException('Credentials are not valid');
        }
    
        const token = this.getJwtToken({ email: guest.email });
        
        // Log para ver el token generado
        console.error('Token generated for user:', email, 'Token:', token);
        console.log(guest)
        return {
            name: guest.name,
            email: guest.email,
            role: guest.role,
            token: token,
        };
    }
    
    private getJwtToken(payload: JwtPayload) {
        const token = this.jwtService.sign(payload);
        return token;
    }
    


}

