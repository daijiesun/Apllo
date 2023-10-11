import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto, CreateArticleTypeDto } from './dto/create-article.dto';
import { UpdateArticleDto, UpdateArticleTypeDto } from './dto/update-article.dto';
import { ApiTags } from '@nestjs/swagger';
import { SearchDto } from './article.interface';
import { PageRequest } from 'src/utils/api.interface';
import { Public } from 'src/auth/roles.decorator';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get("/list")
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Patch('/update')
  update(@Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
  @Patch('/batch')
  batchRemove(@Body() ids: string[]){
    return this.articleService.batchRemove(ids)
  }
  @Public()
  @Post("/page")
  search(@Body() searchDto: PageRequest<SearchDto>){
    return this.articleService.search(searchDto)
  }

  // about the gooods type
  @Post("/type")
  createArticleType(@Body() dto: CreateArticleTypeDto){
    return this.articleService.createArticleType(dto)
  }
  @Get("/type/list")
  getTypeAll(){
    return this.articleService.getTypeAll();
  }

  @Delete("/type/:id")
  removeArticleType(@Param('id') id: string){
    return this.articleService.removeArticleType(id);
  }

  @Patch('/type/submit')
  updateArticleType(@Body() dto: UpdateArticleTypeDto) {
    return this.articleService.updateArticleType(dto);
  }
}
