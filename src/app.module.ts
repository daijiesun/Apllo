import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { ImagesModule } from './images/images.module';
import { GoodsModule } from './goods/goods.module';
import { UploadModule } from './upload/upload.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule as Config } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './auth/strategies/jwt.strategy';

import { APP_GUARD } from '@nestjs/core';
import { LocalStrategy } from './auth/strategies/local.stategy';

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
    synchronize: false,//env === 'production' ? false : true,//是否在每次应用程序启动时自动创建数据库架构
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

@Module({
  imports: [
    serveStatic,
    ormConfig,
    modeConfig,
    AuthModule,
    UsersModule,
    ImagesModule,
    GoodsModule,
    UploadModule,
    Config,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: LocalStrategy,
  }],
})
export class AppModule { }
