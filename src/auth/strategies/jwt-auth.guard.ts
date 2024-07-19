/**
* @description:  全局jwt拦截，请求中如果没有
* @fileName:  jwt-auth.guard
* @author: SunDaijie
* @date: 2024-07-19 10:02:40
* @version: V1.0.0
*/
import { ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // 调用父类的 canActivate 方法以执行 Passport 策略
    return super.canActivate(context);
  }
  handleRequest(err, user, info) {
    if (err || !user) {
      if (info && info.name == 'TokenExpiredError') {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Token has expired',
        });
      } else if (info && info.name == 'JsonWebTokenError') {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid token',
        });
      } else if (info && info.message === 'No auth token') {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'No authentication token provided',
        });
      }
      throw err || new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }
    return user;
  }
}
