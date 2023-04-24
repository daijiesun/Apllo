import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { CreateGoodDto, CreateGoodsTypeDto } from './dto/create-good.dto';
import { UpdateGoodDto, UpdateGoodsTypeDto } from './dto/update-good.dto';
import { ApiTags } from '@nestjs/swagger';
import { SearchDto } from './goods.interface';
import { PageRequest } from 'src/utils/api.interface';
import { Public } from 'src/auth/roles.decorator';
@ApiTags('Goods')
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post()
  create(@Body() createGoodDto: CreateGoodDto) {
    return this.goodsService.create(createGoodDto);
  }

  @Get("/list")
  findAll() {
    return this.goodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goodsService.findOne(id);
  }

  @Patch('/update')
  update(@Body() updateGoodDto: UpdateGoodDto) {
    return this.goodsService.update(updateGoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goodsService.remove(id);
  }
  @Patch('/batch')
  batchRemove(@Body() ids: string[]){
    return this.goodsService.batchRemove(ids)
  }
  @Public()
  @Post("/page")
  search(@Body() searchDto: PageRequest<SearchDto>){
    return this.goodsService.search(searchDto)
  }

  // about the gooods type
  @Post("/type")
  createGoodsType(@Body() dto: CreateGoodsTypeDto){
    return this.goodsService.createGoodsType(dto)
  }
  @Get("/type/list")
  getTypeAll(){
    return this.goodsService.getTypeAll();
  }

  @Delete("/type/:id")
  removeGoodsType(@Param('id') id: string){
    return this.goodsService.removeGoodsType(id);
  }

  @Patch('/type/submit')
  updateGoodsType(@Body() dto: UpdateGoodsTypeDto) {
    return this.goodsService.updateGoodsType(dto);
  }
}
