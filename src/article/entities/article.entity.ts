import { Entity, Column, JoinColumn, OneToOne, OneToMany, ManyToOne } from 'typeorm';
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
import { BaseContent } from "../../common/base-enty";
@Entity()
export class Article extends BaseContent {
    @Column({
        comment: "名称",
        default: ''
    })
    @MinLength(1, {
        message: "名称不能为空",
    })
    title: string

    @Column({
        comment: "所属类型",
        type: "char",
        length: 36
    })
    type: string;

    @Column({
        comment: "描述",
        default: ''
    })
    description: string

    @Column({
        comment: '封面图',
        default: ''
    })
    avatar: string

    @Column({
        comment: "内容",
        default: ''
    })
    details: string

    @Column({
        comment: '是否有效',
        default: true
    })
    isValid: boolean

    @Column({
        comment: '所属用户',
        default: ''
    })
    userId: string
}