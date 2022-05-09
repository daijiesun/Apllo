import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
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

@Entity()
export class User extends BaseContent{
  @MinLength(2, {
    message: "The username must be more than 2 characters"
  })
  @Column({ unique: true })
  username: string;

  @Column({ default: true })
  isActive: boolean;

  
  @Exclude()//序列化，返回实体的时候不显示
  @Column({ select: false}) 
  @MinLength(6, {
    message: "The password must be more than 6 characters"
  })
  @Column()
  password: string;

  @Length(11, 11, {
    message: 'The phone number must be 11 digits'
  })
  @Column({
    length: 11,
    unique: true
  })
  phoneNum: string;
}