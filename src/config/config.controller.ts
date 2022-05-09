import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfigService } from './config.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}


  @Patch('/base')
  update(@Body() updateConfigDto: UpdateConfigDto) {
    return this.configService.update(updateConfigDto);
  }

  @Get('/base')
  getInfo() {
    return this.configService.getBaseInfo();
  }
}
