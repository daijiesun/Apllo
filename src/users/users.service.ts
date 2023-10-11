import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, Not } from 'typeorm';
import { validate } from 'class-validator';
import { User } from './entities/user.entity';

import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SearchDto, UserRO } from './users.interface';
import { PageRequest, PageResponse, ResPonseOB } from 'src/utils/api.interface';

const jwt = require('jsonwebtoken');
const SECRET = "sdjsdjsdj";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  // 注册
  async register(dto: RegisterUserDto): Promise<ResPonseOB<UserRO>> {
    const db = await this.userRepository//getRepository(User)
      .createQueryBuilder("user")
      .where("user.username = :username", { username: dto.username })
    // .orWhere("user.phoneNum = :phoneNum", { phoneNum: dto.phoneNum });

    const user = await db.getOne();
    if (user) {
      throw new HttpException({ message: 'Username Or phoneNum is exist', status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    Object.assign(newUser, { username: dto.username, phoneNum: dto.phoneNum, password: dto.password });
    const errors = await validate(newUser);
    if (errors.length) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: errors }, HttpStatus.BAD_REQUEST);
    }

    const dbUser = await this.userRepository.save(newUser);
    return {
      status: HttpStatus.CREATED,
      data: this.genRO(dbUser)
    };
  }

  // 添加用户
  async create(dto: CreateUserDto): Promise<ResPonseOB<any>> {
    const db = await this.userRepository
      .createQueryBuilder("user")
      .where("user.username = :username", { username: dto.username })
    const user = await db.getOne();
    if (user) {
      throw new HttpException({ message: '用户名已存在', status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
    }
    const newUser = new User()
    Object.assign(newUser, {
      username: dto.username,
      phoneNum: dto.phoneNum,
      password: dto.password,
      role: dto.role,
      isActive: dto.isActive,
    })
    const errors = await validate(newUser);
    if (errors.length) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, message: errors }, HttpStatus.BAD_REQUEST);
    }

    const dbUser = await this.userRepository.save(newUser);
    return {
      status: HttpStatus.CREATED,
      data: undefined
    };
  }
  async findPage(p: PageRequest<SearchDto>): Promise<ResPonseOB<PageResponse<UserRO>>> {
    const db = await this.userRepository
      .createQueryBuilder('user')
      .where("user.username like :username", { username: `%${p.params.username}%` })
      .andWhere("user.phoneNum like :phoneNum", { phoneNum: `%${p.params.phoneNum}%` })
      .andWhere("user.isActive like :isActive", { isActive: `%${p.params.isActive === true ? 1 : p.params.isActive === false ? 0 : ''}%` })
      .skip((p.page - 1) * p.pageSize)
      .take(p.pageSize)
      .getManyAndCount();
    console.log(db);
    return {
      status: HttpStatus.OK,
      data: {
        total: db[1],
        data: db[0],
        page: p.page,
        pageSize: p.pageSize
      }
    }
  }
  async findAll(): Promise<ResPonseOB<User[]>> {
    const users: User[] | undefined = await this.userRepository.find({ isActive: true });
    return {
      status: HttpStatus.OK,
      data: users ? users : []
    }
  }

  async findOne(id: string): Promise<ResPonseOB<UserRO | null>> {
    const user = await this.userRepository.findOne({ id });
    return {
      status: HttpStatus.OK,
      data: user ? this.genRO(user) : null
    }
  }
  async findOneByUserNameOrPhoneNum(str: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: [{ username: str }, { phoneNum: str }] });
    return user;
  }
  async update(updateUserDto: UpdateUserDto): Promise<ResPonseOB<boolean>> {
    const { id } = updateUserDto;
    const user = await this.userRepository.findOne({ id });
    if (!user) {
      throw new HttpException({ message: "User not exist", status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
    }
    const hasUser = await this.userRepository.findOne({
      where: [
        { username: updateUserDto.username, id: Not(id) },
        // { phoneNum: updateUserDto.phoneNum, id: Not(id) }
      ]
    })

    if (hasUser) {
      throw new HttpException({ message: "用户名已存在", status: HttpStatus.BAD_REQUEST }, HttpStatus.BAD_REQUEST);
    };

    const dbQuery = await this.userRepository.createQueryBuilder();
    dbQuery
      .update()
      .set({ username: updateUserDto.username, role: updateUserDto.role, isActive: updateUserDto.isActive,phoneNum:updateUserDto.phoneNum })
      .where("id = :id", { id: updateUserDto.id })
      .execute();

    return {
      status: HttpStatus.OK,
      data: true
    }
  }

  async remove(id: string): Promise<ResPonseOB<boolean>> {
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .where("id = :id", { id })
      .execute();
    return {
      status: HttpStatus.OK,
      data: true
    }
  }

  async batchRemove(ids: Array<string>): Promise<ResPonseOB<boolean>> {
    await this.userRepository
      .createQueryBuilder()
      .delete()
      .where("id IN (:...ids)", { ids })
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