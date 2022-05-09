import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './entities/config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Config])],
  controllers: [ConfigController],
  providers: [ConfigService],
  // exports: [ConfigService]
})
export class ConfigModule { }
