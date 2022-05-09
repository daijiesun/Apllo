import { BaseContent } from "../../common/baseEnty";
import { Column, Entity } from "typeorm";

@Entity()
export class Config extends BaseContent {

  @Column()
  topTip: string = ""; // 跑马灯

  @Column()
  payCodeUrl: string = ""; // 收款码
}
