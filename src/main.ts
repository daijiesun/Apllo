import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// 静态文件请求，需要使用下面的插件
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
// 拦截器
import {JwtInterceptor} from './Interceptor/jwt.Interceptor'
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
  // cros
  app.enableCors();
  
  //静态文件请求路径
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/'
  })

  app.useGlobalInterceptors(new JwtInterceptor())
  // port
  await app.listen(3000);

  console.log(colors.red(`Application is running on: ${await app.getUrl()}`));
  console.log(colors.red(`Environment: ${process.env.NODE_ENV}`))
  console.log(colors.red(`Application Name: ${process.env.APPLICATION}`))

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
