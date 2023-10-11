import { PartialType } from '@nestjs/swagger';
import { CreateArticleDto,CreateArticleTypeDto } from './create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
     readonly id:string
}

export class UpdateArticleTypeDto extends PartialType(CreateArticleTypeDto){
    public readonly id:string
}