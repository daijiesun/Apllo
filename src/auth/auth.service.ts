import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ResPonseOB } from 'src/utils/api.interface';
import { UserRO } from 'src/users/users.interface';
import { LoginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUserByPwd(usernameOrPhone: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUserNameOrPhoneNum(usernameOrPhone);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  // 登录
  async login(user: LoginDto): Promise<ResPonseOB<string | Object>> {
    const result = await this.validateUserByPwd(user.username, user.password)
    if (!result) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: '用户名或密码错误'
      }
    }
    // 生成token和其他操作，比如存redis
    const payload = { username: result.username, sub: result.id };
    return {
      status: HttpStatus.OK,
      data: {
        ...result,
        token: `Bearer ${this.jwtService.sign(payload)}`
      }
    };
  }
  // 注册
  async register(user: LoginDto): Promise<ResPonseOB<string | Object>> {
    const has = await this.usersService.findOneByUserNameOrPhoneNum(user.username);
    if(has) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: '该用户已存在'
      }
    }
    const newUser = await this.usersService.register({username: user.username, password: user.password})
    if (newUser && newUser.status === HttpStatus.CREATED) {
    // 生成token和其他操作，比如存redis
      const payload = { username: newUser.data.username, sub: newUser.data.id };
      return {
        status: HttpStatus.OK,
        data: {
          ...newUser,
          token: `Bearer ${this.jwtService.sign(payload)}`
        }
      };
    }

  }
  // 根据token获取用户信息
  async getUserInfoByToken(token: string): Promise<ResPonseOB<null | UserRO>> {
    const result = {
      status: HttpStatus.BAD_REQUEST,
      data: null
    }
    const userInfo = this.jwtService.decode(token)
    if (userInfo?.sub) {
      // 先从redis取，redis没有从数据库取
      return this.usersService.findOne(userInfo.sub)
    }
    return result
  }
}
