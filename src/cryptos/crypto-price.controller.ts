import { Controller, Post, Put, Delete, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CryptoPriceService } from './crypto-price.service';
import { CreateCryptoDto } from './dto/create-crypto.dto';
import { UpdateCryptoDto } from './dto/update-crypto.dto';

@ApiTags('cryptos')
@Controller('cryptos')
export class CryptoPriceController {
  constructor(private readonly cryptoPriceService: CryptoPriceService) {}

  @Post('update')
  @ApiOkResponse({ description: 'Mise à jour manuelle des prix effectuée.' })
  async updatePrices() {
    await this.cryptoPriceService.triggerPriceUpdate();
    return { message: 'Mise à jour manuelle des prix effectuée.' };
  }

  @Post('add')
  @ApiCreatedResponse({ description: 'Crypto ajoutée au suivi.' })
  async addCrypto(@Body() createCryptoDto: CreateCryptoDto) {
    const record = await this.cryptoPriceService.addCrypto(
      createCryptoDto.crypto,
      createCryptoDto.fullName,
      createCryptoDto.coinId,
    );
    return { message: 'Crypto ajoutée au suivi', record };
  }

  @Delete('remove/:crypto')
  @ApiOkResponse({ description: 'Crypto supprimée du suivi.' })
  async removeCrypto(@Param('crypto') crypto: string) {
    await this.cryptoPriceService.removeCrypto(crypto);
    return { message: `Crypto ${crypto} supprimée du suivi` };
  }

  @Put(':crypto')
  @ApiOkResponse({ description: 'Crypto mise à jour.' })
  async updateCrypto(
    @Param('crypto') crypto: string,
    @Body() updateCryptoDto: UpdateCryptoDto,
  ) {
    const updatedRecord = await this.cryptoPriceService.updateCrypto(crypto, updateCryptoDto);
    return { message: `Crypto ${crypto} mise à jour`, record: updatedRecord };
  }

  @Get()
  @ApiOkResponse({ description: 'Liste des cryptos suivies.' })
  async getTrackedCryptos() {
    return await this.cryptoPriceService.getTrackedCryptos();
  }
}
