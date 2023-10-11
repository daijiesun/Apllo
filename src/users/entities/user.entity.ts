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
import { BaseContent } from "../../common/baseEnty";
import { Role } from '../users.interface';

@Entity()
export class User extends BaseContent{

  @MinLength(2, {
    message: "用户名至少两位字符"
  })
  @Column({ unique: true })
  username: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: Role.visitor})
  role: Role;
  
  @Exclude()//序列化，返回实体的时候不显示
  @Column({ select: false}) 
  @MinLength(6, {
    message: "密码至少6位字符"
  })
  @Column()
  password: string;

  @Column({
    length: 11,
    default: ''
  })
  phoneNum: string;
}