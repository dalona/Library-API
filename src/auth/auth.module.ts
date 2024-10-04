import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GuestsModule } from '../guests/guests.module';
import { GuestService } from '../guests/guests.service';
import { Guest } from 'src/guests/entities/guest.entity';
import { RolesGuard } from './guards/roles.guard';


@Module({
  imports:[ConfigModule ,TypeOrmModule.forFeature([]), 
  GuestsModule,
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory:(configService:ConfigService)=>{      
        return {
          secret:configService.get('JWT_SECRET'),
          signOptions:{expiresIn:'2h'}
      }},
      inject:[ConfigService],
    }),
    TypeOrmModule.forFeature([Guest]),
  ],
  controllers: [AuthController],
  providers: [AuthService, GuestService, JwtStrategy,RolesGuard],
  exports:[TypeOrmModule, JwtStrategy, PassportModule, JwtModule,RolesGuard]
})
export class AuthModule {}