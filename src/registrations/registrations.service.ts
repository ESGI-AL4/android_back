// src/registrations/registrations.service.ts

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async create(createRegistrationDto: CreateRegistrationDto, userId: number) {
    try {
      return await this.prisma.registration.create({
        data: {
          userId,
          meetingId: createRegistrationDto.meetingId,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Vous êtes déjà inscrit à ce meeting');
      } else {
        throw error;
      }
    }
  }

  async findRegistrationsByUserId(userId: number): Promise<any[]> {
    return this.prisma.registration.findMany({
      where: { userId },
      include: { meeting: true },
    });
  }

  async remove(meetingId: number, userId: number) {
    const registration = await this.prisma.registration.findUnique({
      where: {
        userId_meetingId: {
          userId,
          meetingId,
        },
      },
    });

    if (!registration) {
      throw new NotFoundException('Inscription non trouvée');
    }

    return this.prisma.registration.delete({
      where: {
        userId_meetingId: {
          userId,
          meetingId,
        },
      },
    });
  }
}
