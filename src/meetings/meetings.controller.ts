// src/meetings/meetings.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('meetings')
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createMeetingDto: CreateMeetingDto, @Req() req: any) {
    return this.meetingsService.create(createMeetingDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.meetingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeetingDto: UpdateMeetingDto,
    @Req() req: any,
  ) {
    return this.meetingsService.update(+id, updateMeetingDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.meetingsService.remove(+id, req.user.id);
  }
}
