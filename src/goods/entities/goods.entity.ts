import { Entity, Column, JoinColumn,OneToOne,OneToMany, ManyToOne } from 'typeorm';
import {
    validate,
    validateOrReject,
    Contains,
    IsInt,
    Length,
    IsEmail,
    IsFQDN,
    IsDate,
    MinLength,
    MaxLength,
} from 'class-validator';
import { BaseContent } from "../../common/baseEnty";
@Entity()
export class Goods  extends BaseContent{
    @Column({
        comment: "商品名称"
    })
    @MinLength(1,{
        message: "the title must be more than 1 characters"
    })
    title: string = "";

    @Column({
        comment: "商品类型",
        type:"char",
        length: 36
    })
    type: string;

    @Column({
        comment: "商品描述"
    })
    @MinLength(1,{
        message: "the title must be more than 1 characters"
    })
    description: string = "";

    @Column({
        comment: '金额'
    })
    amount: number = 0;

    @Column({
        comment: '库存'
    })
    count: number = 0;

    @Column({
        comment: '缩略图'
    })
    avatar: string = "";

    @Column({
        comment: '轮播图片',
        type: 'simple-array'
    })
    swipeImages: string[] = [];

    @Column({
        comment: "商品详情"
    })
    details: string = "";

    @Column({
        comment: '是否有效'
    })
    isValid: boolean = true;
}