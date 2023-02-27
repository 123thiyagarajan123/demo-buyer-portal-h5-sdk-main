import { MIRecord } from '@infor-up/m3-odin';

export interface IBuyer extends MIRecord {
  USID: string;
  TX40: string;
}
