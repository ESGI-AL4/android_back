import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCryptoDto } from './dto/update-crypto.dto';

@Injectable()
export class CryptoPriceService {
  private readonly logger = new Logger(CryptoPriceService.name);

  constructor(private readonly prisma: PrismaService) {
  }

  // Ajoute une crypto au suivi (création dans la table CurrentCryptoPrice)
  async addCrypto(crypto: string, fullName: string, coinId: string): Promise<any> {
    return this.prisma.currentCryptoPrice.create({
      data: { crypto, fullName, coinId, price: 0 },
    });
  }

  // Supprime une crypto du suivi (supprime aussi son historique)
  async removeCrypto(crypto: string): Promise<void> {
    await this.prisma.cryptoPriceHistory.deleteMany({ where: { crypto } });
    await this.prisma.currentCryptoPrice.delete({ where: { crypto } });
  }

  // Récupère la liste des cryptos suivies
  async getTrackedCryptos(): Promise<any[]> {
    return this.prisma.currentCryptoPrice.findMany();
  }

  // Met à jour (ou crée) le prix courant d'une crypto et ajoute un enregistrement historique
  async updateCryptoPrice(cryptoRecord: any, price: number): Promise<void> {
    await this.prisma.currentCryptoPrice.upsert({
      where: { crypto: cryptoRecord.crypto },
      update: { price },
      create: {
        crypto: cryptoRecord.crypto,
        fullName: cryptoRecord.fullName,
        coinId: cryptoRecord.coinId,
        price,
      },
    });
    await this.prisma.cryptoPriceHistory.create({
      data: {
        crypto: cryptoRecord.crypto,
        fullName: cryptoRecord.fullName,
        coinId: cryptoRecord.coinId,
        price,
      },
    });
    this.logger.log(`Prix de ${cryptoRecord.crypto} mis à jour: ${price}`);
  }

  // Récupère le prix d'une crypto via CoinGecko en utilisant le coinId
  async fetchPrice(coinId: string): Promise<number> {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
      );
      return response.data[coinId].usd;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération du prix pour ${coinId}`, error);
      return 0;
    }
  }

  // Cron job : met à jour les prix pour toutes les cryptos suivies chaque heure
  @Cron(CronExpression.EVERY_HOUR)
  async updateAllCryptoPrices(): Promise<void> {
    this.logger.log('Mise à jour des prix des cryptos (cron hourly)');
    const trackedCryptos = await this.getTrackedCryptos();
    for (const cryptoRecord of trackedCryptos) {
      const price = await this.fetchPrice(cryptoRecord.coinId);
      if (price > 0) {
        await this.updateCryptoPrice(cryptoRecord, price);
      }
    }
  }

  // Déclenchement manuel de la mise à jour des prix
  async triggerPriceUpdate(): Promise<void> {
    this.logger.log('Déclenchement manuel de la mise à jour des prix des cryptos');
    await this.updateAllCryptoPrices();
  }

  // Met à jour les informations d'une crypto (nom complet et/ou coinId)
  // Le champ "crypto" (symbole) reste le même et sert de clé unique.
  async updateCrypto(crypto: string, updateDto: UpdateCryptoDto): Promise<any> {
    try {
      const updatedRecord = await this.prisma.currentCryptoPrice.update({
        where: { crypto },
        data: updateDto,
      });
      this.logger.log(`Crypto ${crypto} mise à jour: ${JSON.stringify(updateDto)}`);
      return updatedRecord;
    } catch (error) {
      this.logger.error(`Erreur lors de la mise à jour de la crypto ${crypto}`, error);
      throw error;
    }
  }

  // Récupère l'historique des prix d'une crypto donnée, trié par date décroissante
  async getCryptoHistory(crypto: string): Promise<any[]> {
    return this.prisma.cryptoPriceHistory.findMany({
      where: { crypto },
      orderBy: { fetchedAt: 'desc' },
    });
  }
}