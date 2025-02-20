// src/news/dto/create-news.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { NewsCategory } from '@prisma/client';

export class CreateNewsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  // La date de publication sera automatiquement définie, mais vous pouvez aussi la laisser en option
  @IsOptional()
  publishedAt?: Date;

  @IsNotEmpty()
  @IsEnum(NewsCategory)
  category: NewsCategory;

  @IsNotEmpty()
  @IsString()
  link: string;
}
