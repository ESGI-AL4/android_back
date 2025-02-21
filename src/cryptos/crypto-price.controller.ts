import { Controller, Post, Delete, Body, Param, Put } from '@nestjs/common';
import { CryptoPriceService } from './crypto-price.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateCryptoDto } from './dto/update-crypto.dto';

@ApiTags('crypto-prices')
@Controller('crypto-prices')
export class CryptoPriceController {
  constructor(private readonly cryptoPriceService: CryptoPriceService) {}

  // Endpoint pour déclencher manuellement la mise à jour des prix
  @Post('update')
  async updatePrices() {
    await this.cryptoPriceService.triggerPriceUpdate();
    return { message: 'Mise à jour manuelle des prix effectuée.' };
  }

  // Ajout d'une crypto au suivi
  @Post('add')
  async addCrypto(
    @Body() body: { crypto: string; fullName: string; coinId: string }
  ) {
    const record = await this.cryptoPriceService.addCrypto(body.crypto, body.fullName, body.coinId);
    return { message: 'Crypto ajoutée au suivi', record };
  }

  // Suppression d'une crypto du suivi (et suppression de l'historique associé)
  @Delete('remove/:crypto')
  async removeCrypto(@Param('crypto') crypto: string) {
    await this.cryptoPriceService.removeCrypto(crypto);
    return { message: `Crypto ${crypto} supprimée du suivi` };
  }

  // Endpoint pour mettre à jour une crypto existante
  @Put(':crypto')
  async updateCrypto(
    @Param('crypto') crypto: string,
    @Body() updateCryptoDto: UpdateCryptoDto,
  ) {
    const updatedRecord = await this.cryptoPriceService.updateCrypto(crypto, updateCryptoDto);
    return { message: `Crypto ${crypto} mise à jour`, record: updatedRecord };
  }
}
