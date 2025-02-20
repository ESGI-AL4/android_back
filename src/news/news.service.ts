import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewsCategory } from '@prisma/client';
import Parser from 'rss-parser';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(private readonly prisma: PrismaService) {}


  // Fonction générique pour récupérer un flux RSS et enregistrer les articles,
  // en évitant les doublons grâce à un upsert basé sur le guid (ou le lien)
  async fetchAndStoreFeed(url: string, category: NewsCategory): Promise<void> {
    const rssParser = new Parser();
    try {
      this.logger.log(`Récupération du flux pour la catégorie ${category} depuis ${url}`);
      const feed = await rssParser.parseURL(url);
      for (const item of feed.items) {
        // On utilise item.guid ou, à défaut, item.link comme identifiant unique
        const uniqueId = item.guid || item.link;
        if (!uniqueId) continue; // On saute l'item s'il n'y a pas d'identifiant unique

        // Utilisation d'un upsert pour éviter d'insérer deux fois le même article
        await this.prisma.news.upsert({
          where: { link: uniqueId },
          update: {},
          create: {
            title: item.title,
            body: item.contentSnippet || item.content || '',
            image: item.enclosure?.url || null,
            author: item.creator || 'Inconnu',
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
            category,
            link: uniqueId,
          },
        });
      }
      this.logger.log(`Flux pour ${category} traité avec succès.`);
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération du flux pour ${category}`, error);
    }
  }

  // Fonction pour récupérer tous les flux RSS
  async fetchAllFeeds(): Promise<void> {
    const feeds = [
      { category: NewsCategory.PRESSE, url: 'https://www.lemonde.fr/cryptomonnaies/rss_full.xml' },
      { category: NewsCategory.TECHNOLOGIE, url: 'https://cryptoast.fr/actu/blockchain/feed/' },
      { category: NewsCategory.ECONOMIE, url: 'https://www.journaldutoken.com/feed/' },
    ];
    await Promise.all(feeds.map(feed => this.fetchAndStoreFeed(feed.url, feed.category)));
  }

  // Cron job : récupère automatiquement tous les flux à minuit chaque jour
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Exécution du cron journalier pour récupérer les flux news');
    await this.fetchAllFeeds();
  }

  // Méthode publique pour déclencher manuellement la récupération des flux RSS
  async triggerFetch(): Promise<void> {
    this.logger.log('Déclenchement manuel de la récupération des flux news');
    await this.fetchAllFeeds();
  }

  async create(createNewsDto: CreateNewsDto) {
    return this.prisma.news.create({
      data: createNewsDto,
    });
  }

  async findAll() {
    return this.prisma.news.findMany();
  }

  async findOne(id: number) {
    return this.prisma.news.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    return this.prisma.news.update({
      where: { id },
      data: updateNewsDto,
    });
  }

  async remove(id: number) {
    return this.prisma.news.delete({
      where: { id },
    });
  }

}