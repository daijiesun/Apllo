
import {Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseContent {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

}