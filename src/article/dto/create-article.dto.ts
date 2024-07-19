export class CreateArticleDto {
    title: string;
    description: string;
    details: string;
    avatar:string;
    type: string;
    swipeImages: string[];
    isValid:boolean;
    userId: string;
}

export class CreateArticleTypeDto{
    title: string;
}