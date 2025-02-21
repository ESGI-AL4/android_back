import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateWalletPositionDto {
  @ApiProperty({ description: 'ID du portefeuille', example: 1 })
  @IsNumber()
  walletId: number;

  @ApiProperty({ description: 'Symbole de la crypto (ex: BTC)', example: 'BTC' })
  @IsString()
  @IsNotEmpty()
  cryptoSymbol: string;

  @ApiProperty({ description: 'Quantité de crypto achetée', example: 0.5 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Prix d\'achat unitaire', example: 45000 })
  @IsNumber()
  purchasePrice: number;
}