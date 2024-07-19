import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Request } from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateArticleDto, CreateArticleTypeDto } from './dto/create-article.dto';
import { UpdateArticleDto, UpdateArticleTypeDto } from './dto/update-article.dto';
import { ApiTags } from '@nestjs/swagger';
import { SearchDto } from './article.interface';
import { PageRequest } from 'src/utils/api.interface';
import { Public } from 'src/auth/roles.decorator';
import { DateTransformInterceptor } from '../interceptor/date-transform.interceptor';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService, private readonly authService: AuthService) { }

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto, @Request() req) {
    // const { data } = await this.authService.getUserInfoByToken(token)
    return this.articleService.create(createArticleDto);
  }

  @Get("list")
  @UseInterceptors(DateTransformInterceptor)
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  @UseInterceptors(DateTransformInterceptor)
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Patch('update')
  update(@Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }

  @Delete('batch/:ids')
  batchDelete(@Param('ids') ids: string) {
    return this.articleService.batchDelete(ids)
  }

  @Public()
  @Post("page")
  @UseInterceptors(DateTransformInterceptor)
  search(@Body() searchDto: PageRequest<SearchDto>) {
    return this.articleService.search(searchDto)
  }

  // 文章类型api
  @Get("type/list")
  @UseInterceptors(DateTransformInterceptor)
  getTypeAll() {
    return this.articleService.getTypeAll()
  }

  @Post("type")
  createArticleType(@Body() dto: CreateArticleTypeDto) {
    return this.articleService.createArticleType(dto)
  }

  @Delete("type/:id")
  removeArticleType(@Param('id') id: string) {
    return this.articleService.removeArticleType(id);
  }

  @Patch('type')
  updateArticleType(@Body() dto: UpdateArticleTypeDto) {
    return this.articleService.updateArticleType(dto);
  }
}
