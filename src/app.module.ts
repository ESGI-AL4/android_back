import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MeetingsModule } from './meetings/meetings.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsModule } from './news/news.module';
import { WalletModule } from './wallet/wallet.module';
import { CryptoPriceModule } from './cryptos/crypto-price.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    MeetingsModule,
    RegistrationsModule,
    NewsModule,
    WalletModule,
    CryptoPriceModule,
    AuthModule,
    ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}