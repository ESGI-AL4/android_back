// src/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, roundsOfHashing);

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        pseudo: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
  }

  async getProfileWithWallet(userId: number) {
    const userProfile = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        meetings: true, // Meetings créés par l'utilisateur
        wallet: {
          include: {
            positions: true,
          },
        },
        registrations: {
          include: {
            meeting: true, // Inclusions des meetings liés aux inscriptions
          },
        },
      },
    });
    if (!userProfile) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return userProfile;
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

}
