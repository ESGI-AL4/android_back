import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateWalletPositionDto {
  @ApiPropertyOptional({ description: 'Nouvelle quantité de crypto détenue', example: 0.75 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({ description: 'Nouveau prix d\'achat unitaire', example: 46000 })
  @IsOptional()
  @IsNumber()
  purchasePrice?: number;
}
