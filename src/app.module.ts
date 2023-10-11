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
// import { JwtStrategy } from './auth/strategies/jwt.strategy';

import { APP_GUARD } from '@nestjs/core';
import { LocalStrategy } from './auth/strategies/local.stategy';
// import { ClientsModule, Transport } from '@nestjs/microservices';
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
    logging: true
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
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: LocalStrategy,
  }],
})
export class AppModule { }
