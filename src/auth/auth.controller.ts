import { Controller, Get, HttpStatus, Post, Param, Request,Headers, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.stategy';
import { AuthGuard } from '@nestjs/passport';
import { Public, Roles } from './roles.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('/login')
  login(@Request() req) {
    return this.authService.login(req.body);
  }

  // @UseGuards(JwtAuthGuard) //自定义扩展jwt策略
  // @UseGuards(AuthGuard('jwt')) // 走jwt策略
  @Public()
  @Post('/logout')
  logout(@Request() req) {
    return {
      status: HttpStatus.OK,
      user: req.user
    };
  }

  // @UseGuards(LocalStrategy)
  @Public()
  @Get('/token')
  @UseGuards(AuthGuard('local'))
  getUserInfoByToken(@Headers('Authorization') token: string) {
    return this.authService.getUserInfoByToken(token)
  }
}
