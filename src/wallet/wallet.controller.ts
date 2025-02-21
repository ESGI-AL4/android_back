import { Controller, Post, Put, Delete, Get, Param, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { CreateWalletPositionDto } from './dto/create-wallet-position.dto';
import { UpdateWalletPositionDto } from './dto/update-wallet-position.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async createWallet(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.createWallet(createWalletDto);
  }

  @Post(':walletId/positions')
  async addPosition(
    @Param('walletId') walletId: string,
    @Body() createPositionDto: CreateWalletPositionDto,
  ) {
    return this.walletService.addPosition({
      ...createPositionDto,
      walletId: Number(walletId),
    });
  }

  @Put('positions/:positionId')
  async updatePosition(
    @Param('positionId') positionId: string,
    @Body() updatePositionDto: UpdateWalletPositionDto,
  ) {
    return this.walletService.updatePosition(Number(positionId), updatePositionDto);
  }

  @Delete('positions/:positionId')
  async removePosition(@Param('positionId') positionId: string) {
    return this.walletService.removePosition(Number(positionId));
  }

  // Endpoint pour mettre à jour un portefeuille spécifique
  @Post(':walletId/update')
  async updateWallet(@Param('walletId') walletId: string) {
    await this.walletService.updateWalletValue(Number(walletId));
    return { message: 'Portefeuille mis à jour' };
  }

  // Endpoint pour mettre à jour tous les portefeuilles
  @Post('update-all')
  async updateAllWallets() {
    await this.walletService.updateAllWallets();
    return { message: 'Tous les portefeuilles mis à jour' };
  }

  // Récupérer un portefeuille par son ID
  @Get(':walletId')
  async getWallet(@Param('walletId') walletId: string) {
    return this.walletService.getWallet(Number(walletId));
  }

  // Récupérer tous les portefeuilles
  @Get()
  async getAllWallets() {
    return this.walletService.getAllWallets();
  }
}
