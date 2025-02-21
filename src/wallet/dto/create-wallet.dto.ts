import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({ description: 'Identifiant de l’utilisateur propriétaire du portefeuille', example: 1 })
  @IsNumber()
  userId: number;
}
