import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { BaseContent } from "../../common/baseEnty";

@Entity()
export class Image extends BaseContent { 

  @Column()
  name: string;

  @Column()
  url: string;

}
