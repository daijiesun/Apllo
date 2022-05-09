import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, getRepository, Not, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Goods } from "./entities/goods.entity"
import { CreateGoodDto, CreateGoodsTypeDto } from './dto/create-good.dto';
import { UpdateGoodDto, UpdateGoodsTypeDto } from './dto/update-good.dto';
import { PageRequest, PageResponse, ResPonseOB } from 'src/utils/api.interface';
import { GoodsRo, SearchDto } from './goods.interface';
import { validate } from 'class-validator';
import { GoodsType } from "./entities/goods_type.entity"
@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Goods)
    private readonly goodsRepository: Repository<Goods>,
  ) { }

  async create(createGoodDto: CreateGoodDto): Promise<ResPonseOB<Boolean>> {
    const goods = new Goods();
    goods.title = createGoodDto.title;
    goods.description = createGoodDto.description;
    goods.amount = createGoodDto.amount;
    goods.avatar = createGoodDto.avatar;
    goods.count = createGoodDto.count;
    goods.type = createGoodDto.type;
    goods.swipeImages = createGoodDto.swipeImages;
    goods.details = createGoodDto.details;
    goods.isValid = createGoodDto.isValid;
    const errors = await validate(goods);
    if (errors.length) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, errors }, HttpStatus.BAD_REQUEST);
    }
    const dbUser = await this.goodsRepository.save(goods);
    return {
      status: HttpStatus.CREATED,
      obj: true//this.genRO(dbUser)
    };
  }

  findAll() {
    return this.goodsRepository.find();
  }

  async findOne(id: string): Promise<ResPonseOB<Goods>> {
    const goods = await this.goodsRepository.findOne({ where: { id } });
    return {
      status: HttpStatus.OK,
      obj: goods
    }
  }

  async update(updateGoodDto: UpdateGoodDto) {
    const goods = new Goods();
    goods.id = updateGoodDto.id;
    goods.title = updateGoodDto.title;
    goods.description = updateGoodDto.description;
    goods.amount = updateGoodDto.amount;
    goods.avatar = updateGoodDto.avatar;
    goods.count = updateGoodDto.count;
    goods.type = updateGoodDto.type;
    goods.swipeImages = updateGoodDto.swipeImages;
    goods.details = updateGoodDto.details;
    goods.isValid = updateGoodDto.isValid;
    const errors = await validate(goods);
    if (errors.length) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, errors }, HttpStatus.BAD_REQUEST);
    }
    const dbUser = await this.goodsRepository.save(goods);
    return {
      status: HttpStatus.CREATED,
      obj: true//this.genRO(dbUser)
    };
  }

  async remove(id: string) {
    const res = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Goods)
      .where("id = :id", { id })
      .execute();

    return {
      status: HttpStatus.OK,
      obj: true
    }
  }
  async batchRemove(ids: string[]) {
    await this.goodsRepository.delete(ids)
    return {
      status: HttpStatus.OK,
      obj: true
    }
  }
  async search(p: PageRequest<SearchDto>): Promise<ResPonseOB<PageResponse<GoodsRo>>> {
    const goodsTable = await getRepository(Goods).createQueryBuilder('goods');
    const obj = await goodsTable
      .leftJoinAndMapOne('goods.goodsType', GoodsType, 'goods_type', 'goods_type.id = goods.type')
      .where("goods.title like :title", { title: `%${p.params.title}%` })
      .andWhere("goods.type like :type", { type: `%${p.params.type}%` })
      .andWhere("goods.isValid like :isValid", { isValid: `%${p.params.isValid ? 1 : p.params.isValid === false ? 0 : ''}%` })
      .skip((p.page - 1) * p.pageSize)
      .take(p.pageSize)
      .getManyAndCount();
    return {
      status: HttpStatus.OK,
      obj: {
        total: obj[1],
        data: obj[0],
        page: p.page,
        pageSize: p.pageSize
      }
    }
  }

  // about goods type api
  async createGoodsType(dto: CreateGoodsTypeDto): Promise<ResPonseOB<boolean>> {
    const goodsType = await getRepository(GoodsType);
    const has = await goodsType.findOne({ title: dto.title })
    if (has) {
      throw new HttpException({ message: 'The type is exist', status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
    }
    const type = new GoodsType();
    type.title = dto.title;
    const errors = await validate(type);
    if (errors.length) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, errors }, HttpStatus.BAD_REQUEST);
    }
    await goodsType.save(type)
    return {
      status: HttpStatus.OK,
      obj: true
    }
  }
  async getTypeAll(): Promise<ResPonseOB<Array<GoodsType>>> {
    const goodsType = await getRepository(GoodsType);
    const list: Array<GoodsType> = await goodsType.find();
    return {
      status: HttpStatus.OK,
      obj: list
    }
  }
  async removeGoodsType(id: string) {
    // 查询有没有商品在用这个类型
    const has = await this.goodsRepository.findOne({ where: { type: id } });
    if (has) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, errors: '该类型有商品正在使用，无法删除！！！' }, HttpStatus.BAD_REQUEST);
    }
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(GoodsType)
      .where("id = :id", { id })
      .execute();

    return {
      status: HttpStatus.OK,
      obj: true
    }
  }
  async updateGoodsType(dto: UpdateGoodsTypeDto) {
    if (dto.id) {
      await getConnection()
        .createQueryBuilder()
        .update(GoodsType)
        .set({ title: dto.title })
        .where("id = :id", { id: dto.id })
        .execute();
    } else {
      const newType = new GoodsType();
      newType.title = dto.title;
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(GoodsType)
        .values([{ title: dto.title }])
        .execute();
    }
    return {
      status: HttpStatus.OK,
      obj: true
    }
  }


  private genRO(goods: Goods): GoodsRo {
    return {
      title: goods.title,
      id: goods.id
    }
  }
}
