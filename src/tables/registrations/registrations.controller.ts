// src/registrations/registrations.controller.ts

import {
  Controller,
  Post,
  Delete,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from '../../DTO/registration/create-registration.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('registrations')
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createRegistrationDto: CreateRegistrationDto, @Req() req: any) {
    return this.registrationsService.create(createRegistrationDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete()
  remove(@Body() createRegistrationDto: CreateRegistrationDto, @Req() req: any) {
    return this.registrationsService.remove(createRegistrationDto.meetingId, req.user.userId);
  }
}
