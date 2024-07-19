// jwt.strategy.ts
import { Injectable, UnauthorizedException, HttpStatus, ExecutionContext } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../roles.decorator';
import { AuthService } from '../auth.service';
import { Role } from 'src/users/users.interface';
// import { InjectHttpContext, HttpContext } from '@nestjs/common'; 
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true, // 是否将request对象传递给validate方法
    });
  }

  async validate(request: Request, payload: any): Promise<any> {
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
      });
    }
    try {
      const userPayload = await this.authService.getUserInfoByToken(token);
      const user = userPayload.data;
      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private matchRoles(roles: Array<string> | undefined, userRole: string) {
    if (!roles || !roles.length || userRole === Role.superAdmin) return true;
    const canActivate = roles.includes(userRole);
    if (!canActivate) {
      throw new UnauthorizedException({
        status: HttpStatus.FORBIDDEN,
        message: 'Forbidden',
      });
    }
    return true;
  }
}

