import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// 静态文件请求，需要使用下面的插件
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
// 拦截器
import {JwtInterceptor} from './Interceptor/jwt.interceptor'

import * as session from 'express-session';

const figlet = require("figlet");
const colors = require('colors');
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.register(helmet, {
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: [`'self'`],
  //       styleSrc: [`'self'`, `'unsafe-inline'`],
  //       imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
  //       scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
  //     },
  //   },
  // });
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000,httpOnly: false, }
    })
  );
  // swagger api配置
  const options = new DocumentBuilder()
    .setTitle('Apollo Api')
    .setDescription('The Apollo Interface')
    .setVersion('1.0')
    .addTag('APOLLO')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  // cross 跨域配置
  app.enableCors();
  
  //静态文件请求路径
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/'
  })

  // 全局拦截器
  app.useGlobalInterceptors(new JwtInterceptor())

  // 启动nest服务
  await app.listen(3000);
  figlet("Apollo Boot", function (err, data) {
    if (err) {
      console.dir(err);
      return;
    }
    console.log(data);
  });
  console.log(colors.red(`Application is running on: ${await app.getUrl()}`));
  console.log(colors.red(`Environment: ${process.env.NODE_ENV}`))
  console.log(colors.red(`Application Name: ${process.env.APPLICATION}`))
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
