/**
* @description: 用户表结构
* @fileName:  user.entity
* @author: SunDaijie
* @date: 2024-07-18 11:46:54
* @version: V1.0.0
*/
import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
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
import { Role } from '../users.interface';

@Entity()
export class User extends BaseContent{

  @MinLength(2, {
    message: "用户名至少两位字符"
  })
  @Column({ unique: true, comment: '用户姓名' })
  username: string;

  @Column({ default: true,comment: '启用状态' })
  isActive: boolean;

  @Column({ default: Role.visitor,comment: '角色' })
  role: Role;
  
  @Exclude()//序列化，返回实体的时候不显示
  @Column({ select: false}) 
  @MinLength(6, {
    message: "密码至少6位字符"
  })
  @Column()
  password: string;

  @Column({comment: '头像', default: ''})
  avatar: string;

  @Column({
    length: 11,
    default: '',
    comment: '电话'
  })
  phoneNum: string;

  @Column({comment: '简介',default: '这个人很懒，什么都没写～'})
  introduction: string
}