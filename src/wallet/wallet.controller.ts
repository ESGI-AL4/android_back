import { Controller, Post, Put, Delete, Get, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { CreateWalletPositionDto } from './dto/create-wallet-position.dto';
import { UpdateWalletPositionDto } from './dto/update-wallet-position.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Portefeuille créé.' })
  async createWallet(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.createWallet(createWalletDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('profile')
  @ApiCreatedResponse({ description: "Portefeuille créé en utilisant l'ID de l'utilisateur issu du token JWT." })
  async createWalletFromToken(@Req() req: any) {
    const userId = req.user.id;
    const createWalletDto: CreateWalletDto = { userId };
    return this.walletService.createWallet(createWalletDto);
  }

  @Post(':walletId/positions')
  @ApiCreatedResponse({ description: 'Position ajoutée au portefeuille.' })
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
  @ApiOkResponse({ description: 'Position mise à jour.' })
  async updatePosition(
    @Param('positionId') positionId: string,
    @Body() updatePositionDto: UpdateWalletPositionDto,
  ) {
    return this.walletService.updatePosition(Number(positionId), updatePositionDto);
  }

  @Delete('positions/:positionId')
  @ApiOkResponse({ description: 'Position supprimée.' })
  async removePosition(@Param('positionId') positionId: string) {
    return this.walletService.removePosition(Number(positionId));
  }

  @Post(':walletId/update')
  @ApiOkResponse({ description: 'Portefeuille mis à jour.' })
  async updateWallet(@Param('walletId') walletId: string) {
    await this.walletService.updateWalletValue(Number(walletId));
    return { message: 'Portefeuille mis à jour' };
  }

  @Post('update-all')
  @ApiOkResponse({ description: 'Tous les portefeuilles mis à jour.' })
  async updateAllWallets() {
    await this.walletService.updateAllWallets();
    return { message: 'Tous les portefeuilles mis à jour' };
  }

  @Get(':walletId')
  @ApiOkResponse({ description: 'Portefeuille récupéré avec ses positions.' })
  async getWallet(@Param('walletId') walletId: string) {
    return this.walletService.getWallet(Number(walletId));
  }

  @Get()
  @ApiOkResponse({ description: 'Liste de tous les portefeuilles avec leurs positions.' })
  async getAllWallets() {
    return this.walletService.getAllWallets();
  }
}
