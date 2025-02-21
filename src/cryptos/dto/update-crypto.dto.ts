import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCryptoDto {
  @ApiPropertyOptional({ description: 'Nouveau nom complet de la crypto', example: 'Bitcoin' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Nouveau CoinId pour CoinGecko', example: 'bitcoin' })
  @IsOptional()
  @IsString()
  coinId?: string;
}
