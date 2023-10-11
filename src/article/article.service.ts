import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, getRepository, Not, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from "./entities/article.entity"
import { CreateArticleDto, CreateArticleTypeDto } from './dto/create-article.dto';
import { UpdateArticleDto, UpdateArticleTypeDto } from './dto/update-article.dto';
import { PageRequest, PageResponse, ResPonseOB } from 'src/utils/api.interface';
import { ArticleRo, SearchDto } from './article.interface';
import { validate } from 'class-validator';
import { ArticleType } from "./entities/article_type.entity"
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) { }

  async create(createArticleDto: CreateArticleDto): Promise<ResPonseOB<Boolean>> {
    const article = new Article();
    article.title = createArticleDto.title;
    article.description = createArticleDto.description;
    article.amount = createArticleDto.amount;
    article.avatar = createArticleDto.avatar;
    article.count = createArticleDto.count;
    article.type = createArticleDto.type;
    article.swipeImages = createArticleDto.swipeImages;
    article.details = createArticleDto.details;
    article.isValid = createArticleDto.isValid;
    const errors = await validate(article);
    if (errors.length) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: errors }, HttpStatus.BAD_REQUEST);
    }
    const dbUser = await this.articleRepository.save(article);
    return {
      status: HttpStatus.CREATED,
      data: true//this.genRO(dbUser)
    };
  }

  findAll() {
    return this.articleRepository.find();
  }

  async findOne(id: string): Promise<ResPonseOB<Article>> {
    const article = await this.articleRepository.findOne({ where: { id } });
    return {
      status: HttpStatus.OK,
      data: article
    }
  }

  async update(updateArticleDto: UpdateArticleDto) {
    const article = new Article();
    article.id = updateArticleDto.id;
    article.title = updateArticleDto.title;
    article.description = updateArticleDto.description;
    article.amount = updateArticleDto.amount;
    article.avatar = updateArticleDto.avatar;
    article.count = updateArticleDto.count;
    article.type = updateArticleDto.type;
    article.swipeImages = updateArticleDto.swipeImages;
    article.details = updateArticleDto.details;
    article.isValid = updateArticleDto.isValid;
    const errors = await validate(article);
    if (errors.length) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: errors }, HttpStatus.BAD_REQUEST);
    }
    const dbUser = await this.articleRepository.save(article);
    return {
      status: HttpStatus.CREATED,
      data: true//this.genRO(dbUser)
    };
  }

  async remove(id: string) {
    const res = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Article)
      .where("id = :id", { id })
      .execute();

    return {
      status: HttpStatus.OK,
      data: true
    }
  }
  async batchRemove(ids: string[]) {
    await this.articleRepository.delete(ids)
    return {
      status: HttpStatus.OK,
      data: true
    }
  }
  async search(p: PageRequest<SearchDto>): Promise<ResPonseOB<PageResponse<ArticleRo>>> {
    const articleTable = await getRepository(Article).createQueryBuilder('article');
    const obj = await articleTable
      .leftJoinAndMapOne('article.articleType', ArticleType, 'article_type', 'article_type.id = article.type')
      .where("article.title like :title", { title: `%${p.params.title}%` })
      .andWhere("article.type like :type", { type: `%${p.params.type}%` })
      .andWhere("article.isValid like :isValid", { isValid: `%${p.params.isValid ? 1 : p.params.isValid === false ? 0 : ''}%` })
      .skip((p.page - 1) * p.pageSize)
      .take(p.pageSize)
      .getManyAndCount();
    return {
      status: HttpStatus.OK,
      data: {
        total: obj[1],
        data: obj[0],
        page: p.page,
        pageSize: p.pageSize
      }
    }
  }

  // about article type api
  async createArticleType(dto: CreateArticleTypeDto): Promise<ResPonseOB<boolean>> {
    const articleType = await getRepository(ArticleType);
    const has = await articleType.findOne({ title: dto.title })
    if (has) {
      throw new HttpException({ message: 'The type is exist', status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
    }
    const type = new ArticleType();
    type.title = dto.title;
    const errors = await validate(type);
    if (errors.length) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: errors }, HttpStatus.BAD_REQUEST);
    }
    await articleType.save(type)
    return {
      status: HttpStatus.OK,
      data: true
    }
  }
  async getTypeAll(): Promise<ResPonseOB<Array<ArticleType>>> {
    const articleType = await getRepository(ArticleType);
    const list: Array<ArticleType> = await articleType.find();
    return {
      status: HttpStatus.OK,
      data: list
    }
  }
  async removeArticleType(id: string) {
    // 查询有没有商品在用这个类型
    const has = await this.articleRepository.findOne({ where: { type: id } });
    if (has) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: '该类型有商品正在使用，无法删除！！！' }, HttpStatus.BAD_REQUEST);
    }
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(ArticleType)
      .where("id = :id", { id })
      .execute();

    return {
      status: HttpStatus.OK,
      data: true
    }
  }
  async updateArticleType(dto: UpdateArticleTypeDto) {
    if (dto.id) {
      await getConnection()
        .createQueryBuilder()
        .update(ArticleType)
        .set({ title: dto.title })
        .where("id = :id", { id: dto.id })
        .execute();
    } else {
      const newType = new ArticleType();
      newType.title = dto.title;
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(ArticleType)
        .values([{ title: dto.title }])
        .execute();
    }
    return {
      status: HttpStatus.OK,
      data: true
    }
  }


  private genRO(article: Article): ArticleRo {
    return {
      title: article.title,
      id: article.id
    }
  }
}
