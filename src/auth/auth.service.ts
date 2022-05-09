import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(usernameOrPhone: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUserNameOrPhoneNum(usernameOrPhone);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      status: HttpStatus.OK,
      obj: {
        username: user.username,
        phoneNum: user.phoneNum,
        token: this.jwtService.sign(payload),
      }
    };
  }
}
