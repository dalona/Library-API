import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, isStrongPassword, MinLength } from "class-validator";

export class CreateGuestDto {
  
  @ApiProperty({
    example: 'Pepito Perez',
    nullable: false
  })
  @IsString()
  @MinLength(10, { message: 'Name must have at least 10 characters'})
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'pepitoperez@correo.com'
  })
  @IsString()
  @IsEmail({},{ message: 'Please enter a valid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Qwer1234*'
  })
  @IsString()
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

}
