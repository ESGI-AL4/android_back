import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './tables/users/users.module';
import { MeetingsModule } from './tables/meetings/meetings.module';
import { RegistrationsModule } from './tables/registrations/registrations.module';

@Module({
  imports: [PrismaModule, UsersModule, MeetingsModule, RegistrationsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
