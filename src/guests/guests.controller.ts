import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Delete,
  Get,
  Param
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GuestService } from './guests.service';
import { Guest } from './entities/guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { RegisterUserDto } from 'src/auth/dto';



@Controller('guests')
export class GuestController {
  constructor(
  private readonly guestService: GuestService) {}


  @Get()
  async findAll(): Promise<Guest[]> {
    return await this.guestService.getAllGuests();
  }

 
  @Get('/:email')
  findOne(@Param('email') email: string){
    return this.guestService.getByEmail(email);
  }


  @Post('register')
 
  async create(
    @Body() CreateGuestDto: RegisterUserDto,
  ): Promise<Partial<Guest>> {
    return await this.guestService.create(CreateGuestDto);
  }

  @Patch('update/')
  @UseGuards(JwtAuthGuard)
  async update(
    @Body('email') email: string,
    @Body() updateGuestDto: UpdateGuestDto,
  ): Promise<Guest> {
    return await this.guestService.update(email, updateGuestDto);
  }

 
  @Delete('')
  @UseGuards(JwtAuthGuard)
  remove(@Body('email') email: string): Promise<string>{
    return this.guestService.remove(email);
  }

}