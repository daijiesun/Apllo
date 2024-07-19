import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { ArticleModule } from './article/article.module';
import { UploadModule } from './upload/upload.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtAuthGuard } from './auth/strategies/jwt-auth.guard';
import { RolesGuard } from './auth/strategies/roles.guard';
const env = process.env.NODE_ENV;
const ormConfig = TypeOrmModule.forRootAsync({
  useFactory: () => ({
    type: process.env.DB_TYPE as any,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["dist/**/*.entity{.ts,.js}"],//[`${env === 'production' ? 'dist/**/':'src/**/'}*.entity{.ts,.js}`],
    synchronize: true, //env === 'production' ? false : true,//是否在每次应用程序启动时自动创建数据库架构
    cache: true,
    retryAttempts: 1,
    autoLoadEntities: true,
    logging: true,
    namingStrategy: new SnakeNamingStrategy(), // orm驼峰转下划线
  }),
});

const serveStatic = ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', 'public'),
  // exclude: ['/api*'],
})
const modeConfig = ConfigModule.forRoot({
  envFilePath: ['.env', '.env.production'],
  ignoreEnvFile: false,
  isGlobal: true,
});

// const redisConfig = ClientsModule.register([
//   {
//     name: 'REDIS_SERVICE',
//     transport: Transport.REDIS,
//     options: {
//       host: process.env.REDIS_HOST,
//       port: Number(process.env.REDIS_PORT)
//     }
//   },
// ])
@Module({
  imports: [
    serveStatic,
    ormConfig,
    modeConfig,
    // redisConfig,
    AuthModule,
    UsersModule,
    ArticleModule,
    UploadModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {  // jwt全局拦截策略
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    { // 角色拦截策略
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
