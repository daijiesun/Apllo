import { CreateImageDto } from "src/images/dto/create-image.dto";
export class CreateGoodDto {
    title: string;
    description: string;
    details: string;
    count: number;
    amount: number;
    avatar:string;
    type: string;
    swipeImages: string[];
    isValid:boolean;
}

export class CreateGoodsTypeDto{
    title: string;
}