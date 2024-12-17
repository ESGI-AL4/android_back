// src/registrations/dto/create-registration.dto.ts

import { IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRegistrationDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  meetingId: number;
}