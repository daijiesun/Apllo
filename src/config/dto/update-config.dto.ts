import { PartialType } from '@nestjs/swagger';

export class UpdateConfigDto {
  topTip: string = ""; // 跑马灯
  payCodeUrl: string = ""; // 收款码
}
