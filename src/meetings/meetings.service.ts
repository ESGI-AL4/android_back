// src/meetings/meetings.service.ts

import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async create(createMeetingDto: CreateMeetingDto, userId: number) {
    const { title, description, date, location, capacity, image } = createMeetingDto;

    return this.prisma.meeting.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity,
        image,
        creatorId: userId,
      },
    });
  }

  findAll() {
    return this.prisma.meeting.findMany({
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            pseudo: true,
          },
        },
        registrations: true,
      },
    });
  }

  async findOne(id: number) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            pseudo: true,
          },
        },
        registrations: true,
      },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting non trouvé');
    }

    return meeting;
  }

  async update(id: number, updateMeetingDto: UpdateMeetingDto, userId: number) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      select: {
        id: true,
        creatorId: true,
      },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting non trouvé');
    }

    if (meeting.creatorId !== userId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à modifier ce meeting");
    }

    // Traitez updateMeetingDto en conséquence
    const { title, description, date, location, capacity, image } = updateMeetingDto;

    return this.prisma.meeting.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(location && { location }),
        ...(capacity !== undefined && { capacity }),
        ...(image && { image }),
      },
    });
  }

  async remove(id: number, userId: number) {
    const meeting = await this.prisma.meeting.findUnique({
      where: { id },
      select: {
        id: true,
        creatorId: true,
      },
    });

    if (!meeting) {
      throw new NotFoundException('Meeting non trouvé');
    }

    if (meeting.creatorId !== userId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à supprimer ce meeting");
    }

    return this.prisma.meeting.delete({
      where: { id },
    });
  }
}
