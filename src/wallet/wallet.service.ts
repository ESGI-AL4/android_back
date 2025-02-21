import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { CreateWalletPositionDto } from './dto/create-wallet-position.dto';
import { UpdateWalletPositionDto } from './dto/update-wallet-position.dto';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createWallet(createWalletDto: CreateWalletDto): Promise<any> {
    return this.prisma.wallet.create({
      data: {
        userId: createWalletDto.userId,
        totalValue: 0,
      },
    });
  }

  async addPosition(createPositionDto: CreateWalletPositionDto): Promise<any> {
    const { walletId, cryptoSymbol, quantity, purchasePrice } = createPositionDto;
    return this.prisma.walletPosition.create({
      data: { walletId, cryptoSymbol, quantity, purchasePrice },
    });
  }

  async updatePosition(positionId: number, updateDto: UpdateWalletPositionDto): Promise<any> {
    return this.prisma.walletPosition.update({
      where: { id: positionId },
      data: updateDto,
    });
  }

  async removePosition(positionId: number): Promise<any> {
    return this.prisma.walletPosition.delete({
      where: { id: positionId },
    });
  }

  async updateWalletValue(walletId: number): Promise<void> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { id: walletId },
      include: { positions: true },
    });
    if (!wallet) throw new Error(`Wallet with id ${walletId} not found`);
    let total = 0;
    for (const position of wallet.positions) {
      const currentPriceRecord = await this.prisma.currentCryptoPrice.findUnique({
        where: { crypto: position.cryptoSymbol },
      });
      if (!currentPriceRecord) {
        this.logger.warn(`Prix courant pour ${position.cryptoSymbol} non trouvé, position ignorée`);
        continue;
      }
      total += position.quantity * currentPriceRecord.price;
    }
    await this.prisma.wallet.update({
      where: { id: walletId },
      data: { totalValue: total },
    });
    this.logger.log(`Portefeuille ${walletId} mis à jour : nouvelle valeur totale = ${total}`);
  }

  async updateAllWallets(): Promise<void> {
    const wallets = await this.prisma.wallet.findMany({ include: { positions: true } });
    for (const wallet of wallets) {
      let total = 0;
      for (const position of wallet.positions) {
        const currentPriceRecord = await this.prisma.currentCryptoPrice.findUnique({
          where: { crypto: position.cryptoSymbol },
        });
        if (!currentPriceRecord) {
          this.logger.warn(`Prix courant pour ${position.cryptoSymbol} non trouvé, position ignorée`);
          continue;
        }
        total += position.quantity * currentPriceRecord.price;
      }
      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { totalValue: total },
      });
      this.logger.log(`Portefeuille ${wallet.id} mis à jour : nouvelle valeur totale = ${total}`);
    }
  }

  // Récupère un portefeuille par son id avec ses positions
  async getWallet(walletId: number): Promise<any> {
    return this.prisma.wallet.findUnique({
      where: { id: walletId },
      include: { positions: true },
    });
  }

  // Récupère tous les portefeuilles
  async getAllWallets(): Promise<any[]> {
    return this.prisma.wallet.findMany({
      include: { positions: true },
    });
  }
}
