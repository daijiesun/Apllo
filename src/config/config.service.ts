import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResPonseOB } from 'src/utils/api.interface';
import { Repository } from 'typeorm';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Config } from './entities/config.entity';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
  ) { }

  async update(dto: UpdateConfigDto): Promise<ResPonseOB<boolean>> {
    const config = await this.configRepository.findOne();
    if (config) {
      config.topTip = dto.topTip;
      config.payCodeUrl = dto.payCodeUrl;
      await this.configRepository.save(config)
    } else {
      const p = new Config();
      p.topTip = dto.topTip;
      p.payCodeUrl = dto.payCodeUrl;
      await this.configRepository.save(p)
    }
    return {
      status: HttpStatus.OK,
      data: true
    }
  }

  async getBaseInfo(): Promise<ResPonseOB<Config | undefined>> {
    const info: Config | undefined = await this.configRepository.findOne();
    return {
      status: HttpStatus.OK,
      data: info
    }
  }
}
