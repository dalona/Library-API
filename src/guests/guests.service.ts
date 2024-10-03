import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { UpdateGuestDto } from './dto/update-guest.dto';
import { Guest } from './entities/guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { RegisterUserDto } from 'src/auth/dto/register.dto';

@Injectable()
export class GuestService {
  
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}

  async create(createGuestDto: RegisterUserDto): Promise<Partial<Guest>> {
    try {
      const existingCustomer = await this.guestRepository.findOneBy({
        email: createGuestDto.email,
      });
  
      if (existingCustomer) {
        throw new ConflictException('Guest already exists');
      }
  
      const hashedPassword = await bcrypt.hash(createGuestDto.password, 10);
      const guest = this.guestRepository.create({
        ...createGuestDto,
        password: hashedPassword
      });
  
      await this.guestRepository.save(guest);
      return {
        name: guest.name,
        email: guest.email,
        role: guest.role,
        id: guest.id
      }
    } catch (error) {
      console.error("Error creating Guest:", error)
      throw new InternalServerErrorException('Failed to create Guest');
    }
  }

  async update(email: string, updateGuestDto: UpdateGuestDto): Promise<Guest> {
    try {
      const guest = await this.guestRepository.findOneBy({ email });
  
      if (!guest) {
        throw new NotFoundException('Guest not found');
      }
  
      if (updateGuestDto.password) {
        updateGuestDto.password = await bcrypt.hash(updateGuestDto.password, 10);
      }
  
      Object.assign(guest, updateGuestDto);
  
      return await this.guestRepository.save(guest);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update guest');
    }
  }

  async remove(email: string): Promise<string> {
    try {
      const result = await this.guestRepository.delete({ email });

      if (result.affected === 0) {
        throw new NotFoundException('Guest not found');
      }

      return 'Guest deleted succesfully'
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getAllGuests(): Promise<Guest[]> {
    try {
      return await this.guestRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to get Guests');
    }
  }

  async getByEmail(email: string): Promise<Guest> {
    try {
      const guest = await this.guestRepository.findOneBy({ email });

      if (!guest) {
        throw new NotFoundException('Guest not found');
      }

      return guest;
    } catch (error) {
      throw new NotFoundException('Failed to get guest');
    }
  }
}
