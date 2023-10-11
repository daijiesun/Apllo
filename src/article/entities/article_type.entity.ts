import { BaseContent } from "../../common/baseEnty";
import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { MinLength } from "class-validator";

@Entity()
export class ArticleType extends BaseContent {

  @Column({
    comment: '分类名称'
  })
  @MinLength(1, {
    message: "the title must be more than 1 characters"
  })
  title: string;

}