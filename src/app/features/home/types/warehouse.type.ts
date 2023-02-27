import { MIRecord } from '@infor-up/m3-odin';

export interface IWarehouse extends MIRecord {
  WHLO: string;
  WHNM: string;
}
