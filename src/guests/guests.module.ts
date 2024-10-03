import { Module } from '@nestjs/common';
import { GuestService } from './guests.service';
import { GuestController } from './guests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Guest])],
  controllers: [GuestController],
  providers: [GuestService,JwtService],
  exports:[TypeOrmModule]
})
export class GuestsModule {}
