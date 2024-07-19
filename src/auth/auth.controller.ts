/**
* @description:  认证控制器
* @fileName:  auth.controller
* @author: SunDaijie
* @date: 2024-07-18 19:17:11
* @version: V1.0.0
*/
import { Controller, Get, HttpStatus, Post, Param, Request, Headers, Response, UseGuards, Body, Session } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public, Roles } from './roles.decorator';
import { LoginDto } from './dto/login-user.dto';
import { ResPonseOB } from 'src/utils/api.interface';
import { Role } from 'src/users/users.interface';
const svgCaptcha = require('svg-captcha');

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  login(@Body() body: LoginDto) {
    // 验证图形验证码
    // const storedCaptcha = session.captcha;
    // if (!storedCaptcha || storedCaptcha.toLowerCase() !== body.imageCode.toLowerCase()) {
    //   return res.send({
    //     status: HttpStatus.BAD_REQUEST,
    //     message: '图形验证码错误'
    //   })
    // }
    return this.authService.login(body);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  register(@Body() body: LoginDto) {
    return this.authService.register(body);
  }
  // @UseGuards(JwtAuthGuard) //自定义扩展jwt策略
  @Public()
  @Post('logout')
  // @UseGuards(AuthGuard('jwt')) // 走jwt策略
  @ApiOperation({ summary: '退出登录' })
  logout(@Request() req) {
    return {
      status: HttpStatus.OK,
      data: null
    };
  }

  @Public()
  @Get('roles')
  @ApiOperation({ summary: '用户角色' })
  roles() {
    return {
      status: HttpStatus.OK,
      data: [
        { code: Role.admin, name: '管理员' },
        { code: Role.superAdmin, name: '超级管理员' },
        { code: Role.visitor, name: '用户' }
      ]
    };
  }

  // 获取图形验证码（这里后期待完善）
  @Public()
  @Get('imageCode')
  async getImageCode(@Session() session, @Response() res) {
    var captcha = svgCaptcha.create();
    console.log(session.captcha);
    if (!session.captcha) {
      session.captcha = {
        time: Date.now(),
        text: captcha.text
      }
    } else if (Date.now() - session.captcha.time < 1000) {
      return {
        status: HttpStatus.BAD_REQUEST,
        errors: '太频繁啦～'
      }
    } else {
      session.captcha.time = Date.now()
      session.captcha.text = captcha.text;
    }
    console.log(session.captcha)
    await new Promise((resolve) => {
      session.save(function (err) {
        if (err) throw err;
        resolve(null);
      });
    });
    res.type('svg');
    res.status(200).send(captcha.data);
  }
}
