import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCryptoDto {
  @ApiProperty({ description: 'Symbole de la crypto (ex: BTC)', example: 'BTC' })
  @IsString()
  @IsNotEmpty()
  crypto: string;

  @ApiProperty({ description: 'Nom complet de la crypto (ex: Bitcoin)', example: 'Bitcoin' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Identifiant CoinGecko de la crypto (ex: bitcoin)', example: 'bitcoin' })
  @IsString()
  @IsNotEmpty()
  coinId: string;
}
