import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, Not } from 'typeorm';
import { validate } from 'class-validator';
import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRO } from './users.interface';
import { ResPonseOB } from 'src/utils/api.interface';

const jwt = require('jsonwebtoken');
const SECRET = "sdjsdjsdj";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(dto: CreateUserDto): Promise<ResPonseOB<UserRO>> {
    const db = await this.usersRepository//getRepository(User)
      .createQueryBuilder("user")
      .where("user.username = :username", { username: dto.username })
      .orWhere("user.phoneNum = :phoneNum", { phoneNum: dto.phoneNum });

    const user = await db.getOne();
    if (user) {
      throw new HttpException({ message: 'Username Or phoneNum is exist', status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    Object.assign(newUser, dto);
    const errors = await validate(newUser);
    if (errors.length) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, errors }, HttpStatus.BAD_REQUEST);
    }

    const dbUser = await this.usersRepository.save(newUser);
    return {
      status: HttpStatus.CREATED,
      data: this.genRO(dbUser)
    };
  }

  async findAll(): Promise<ResPonseOB<User[]>> {
    const users: User[] | undefined = await this.usersRepository.find({ isActive: true });
    return {
      status: HttpStatus.OK,
      data: users ? users : []
    }
  }

  async findOne(id: string): Promise<ResPonseOB<UserRO | null>> {
    const user = await this.usersRepository.findOne({ id });
    return {
      status: HttpStatus.OK,
      data: user ? this.genRO(user) : null
    }
  }
  async findOneByUserNameOrPhoneNum(str: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: [{ username: str }, { phoneNum: str }] });
    return user;
  }
  async update(updateUserDto: UpdateUserDto): Promise<ResPonseOB<boolean>> {
    const { id } = updateUserDto;
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new HttpException({ message: "User not exist", status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
    }
    const hasUser = await this.usersRepository.findOne({
      where: [{ username: updateUserDto.username, id: Not(id) }, { phoneNum: updateUserDto.phoneNum, id: Not(id) }]
    })

    if (hasUser) {
      throw new HttpException({ message: "Username Or phoneNum is exist", status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
    };

    const dbQuery = await this.usersRepository.createQueryBuilder();
    dbQuery
      .update()
      .set(updateUserDto)
      .where("id = :id", { id: updateUserDto.id })
      .execute();

    return {
      status: HttpStatus.OK,
      data: true
    }
  }

  async remove(id: string): Promise<ResPonseOB<boolean>> {
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :id", { id })
      .execute();
    return {
      status: HttpStatus.OK,
      data: true
    }
  }
  public generateJWT(user: User) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      username: user.username,
      phoneNum: user.phoneNum,
      exp: exp.getTime() / 1000,
    }, SECRET);
  };
  private genRO(user: User): UserRO {
    const { password, ...other } = user
    return other
  }
}