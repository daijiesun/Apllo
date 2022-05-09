import { PartialType } from '@nestjs/swagger';
import { CreateGoodDto,CreateGoodsTypeDto } from './create-good.dto';

export class UpdateGoodDto extends PartialType(CreateGoodDto) {
     readonly id:string
}

export class UpdateGoodsTypeDto extends PartialType(CreateGoodsTypeDto){
    public readonly id:string
}