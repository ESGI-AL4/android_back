// src/meetings/meetings.service.ts

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeetingDto } from '../DTO/create-meeting.dto';
import { UpdateMeetingDto } from '../DTO/update-meeting.dto';

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async create(createMeetingDto: CreateMeetingDto, userId: number) {
    return this.prisma.meeting.create({
      data: {
        ...createMeetingDto,
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

  findOne(id: number) {
    return this.prisma.meeting.findUnique({
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
  }

  async update(id: number, updateMeetingDto: UpdateMeetingDto, userId: number) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id } });

    if (meeting.creatorId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier ce meeting');
    }

    return this.prisma.meeting.update({
      where: { id },
      data: updateMeetingDto,
    });
  }

  async remove(id: number, userId: number) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id } });

    if (meeting.creatorId !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer ce meeting');
    }

    return this.prisma.meeting.delete({
      where: { id },
    });
  }
}
