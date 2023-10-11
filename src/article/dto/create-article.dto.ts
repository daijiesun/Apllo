export class CreateArticleDto {
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

export class CreateArticleTypeDto{
    title: string;
}