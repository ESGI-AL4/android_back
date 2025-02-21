// src/registrations/registrations.controller.ts

import {
  Controller,
  Post,
  Delete,
  UseGuards,
  Req,
  Body,
  Get,
  Param, ParseIntPipe,
} from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

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

  @Get('user/:userId')
  @ApiOkResponse({ description: "Liste des meetings auxquels l'utilisateur est inscrit." })
  async getMeetingsForUser(@Param('userId', ParseIntPipe) userId: number) {
    const registrations = await this.registrationsService.findRegistrationsByUserId(userId);
    return registrations.map(registration => registration.meeting);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete()
  remove(@Body() createRegistrationDto: CreateRegistrationDto, @Req() req: any) {
    return this.registrationsService.remove(createRegistrationDto.meetingId, req.user.userId);
  }
}
