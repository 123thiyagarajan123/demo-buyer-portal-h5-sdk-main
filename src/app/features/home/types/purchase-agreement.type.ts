import { MIRecord } from '@infor-up/m3-odin';

export interface IPurchaseAgreement extends MIRecord {
  AJSUNO: string;
  AJPUPR: number;
  AJAGNB: string;
  AIUVDT: Date;
  AHPAST: string;
}
