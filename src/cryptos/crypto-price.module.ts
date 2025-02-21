import { Module } from '@nestjs/common';
import { CryptoPriceController } from './crypto-price.controller';
import { CryptoPriceService } from './crypto-price.service';

@Module({
  controllers: [CryptoPriceController],
  providers: [CryptoPriceService],
  exports: [CryptoPriceService],
})
export class CryptoPriceModule {}
