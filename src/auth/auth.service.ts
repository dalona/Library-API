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
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: loginUserDto) {
    const { password, email } = loginDto;

    console.log('Attempting login for email:', email);

    try {
      const guest = await this.guestRepository.createQueryBuilder('guest')
        .where('guest.email = :email', { email })
        .select(['guest.name', 'guest.email', 'guest.password', 'guest.role'])
        .getOne();

      if (!guest) {
        console.error('User not found:', email);
        throw new UnauthorizedException('Invalid credentials');
      }

      console.log('User found:', guest.email);

      const isPasswordValid = await this.validatePassword(password, guest.password);
      if (!isPasswordValid) {
        console.error('Invalid password for user:', email);
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.generateJwtToken({ email: guest.email });
      console.log('Token generated for user:', email);

      return this.buildLoginResponse(guest, token);
    } catch (error) {
      console.error('Error during login process:', error);
      throw error;
    }
  }

  private async validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainTextPassword, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }

  private generateJwtToken(payload: JwtPayload): string {
    try {
      return this.jwtService.sign(payload);
    } catch (error) {
      console.error('Error generating JWT token:', error);
      throw new Error('Failed to generate authentication token');
    }
  }

  private buildLoginResponse(guest: Guest, token: string) {
    console.log('Building login response for user:', guest.email);
    return {
      name: guest.name,
      email: guest.email,
      role: guest.role,
      token: token,
    };
  }
}
