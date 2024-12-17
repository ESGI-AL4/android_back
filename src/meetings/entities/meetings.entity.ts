// src/articles/entities/meetings.entity.ts

import { Meeting } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class MeetingEntity implements Meeting {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  date: Date;

  @ApiProperty({ required: false, nullable: true })
  location: string | null;

  @ApiProperty({ required: false, nullable: true })
  capacity: number | null;

  @ApiProperty()
  creatorId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false, nullable: true })
  image: string | null;

  @ApiProperty({ required: false, nullable: true })
  creator: any;

  constructor({ creator, ...data }: Partial<MeetingEntity>) {
    Object.assign(this, data);

    if (creator) {
      this.creator = new UserEntity(creator);
    }
  }

}