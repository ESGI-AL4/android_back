// src/users/dto/create-user.dto.ts

import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  pseudo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ required: false, enum: ['user', 'admin'] })
  @IsOptional()
  @IsIn(['user', 'admin', 'superadmin'])
  role?: string;
}
