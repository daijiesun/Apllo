import { Controller, Get, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './strategies/jwtAuthGuard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  login(@Request() req) {
    // return req.user;
    return this.authService.login(req.user);
  }

  // @UseGuards(JwtAuthGuard) //自定义扩展jwt策略
  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  logout(@Request() req) {
    return {
      status: HttpStatus.OK,
      user: req.user
    };
  }
}
