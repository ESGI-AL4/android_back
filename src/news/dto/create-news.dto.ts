// src/news/dto/create-news.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { NewsCategory } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  author: string;

  // La date de publication sera automatiquement définie, mais vous pouvez aussi la laisser en option
  @ApiProperty({ required: false })
  @IsOptional()
  publishedAt?: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(NewsCategory)
  category: NewsCategory;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  link: string;
}
