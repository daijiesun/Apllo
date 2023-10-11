/**
 * Author: SunDaijie
 * Module: 用于实现用户权限控制
 * 
**/

import {
  ExecutionContext,
  HttpCode,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  CanActivate
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../roles.decorator';
import { AuthService } from '../auth.service';

//extends AuthGuard('jwt')
//implements CanActivate
@Injectable()
export class LocalStrategy extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private readonly jwtService: JwtService, private readonly authService: AuthService) {
    super()
  }
  async canActivate(context: ExecutionContext) {
    return true
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    if (!token) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: "Unauthorized"
      });
    }
    // 角色权限
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    try {
      // const payload = this.jwtService.verify(token, {})
      const payload = await this.authService.getUserInfoByToken(token)
      const user = payload.data
      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    const user = request.user;
    return this.matchRoles(roles, user.roles);
    // return super.canActivate(context); //走下面的handleRequest方法
  }

  handleRequest(err, user, info) {
    // 可以抛出一个基于info或者err参数的异常
    if (err || !user) {
      throw err || new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: "Unauthorized"
      });
    }
    return user;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  matchRoles(roles, userRoles) {
    // 权限认证逻辑
    if (false) {
      throw new UnauthorizedException({
        status: HttpStatus.FORBIDDEN,
        message: "Forbidden"
      });
    }
    return true
  }
}

