import { MIRecord } from '@infor-up/m3-odin';

export interface IPlannedPurchaseOrder extends MIRecord {
  POSUNO: string;
  IDSUNM: string;
  POPLPN: string;
  POITNO: string;
  POPITD: string;
  POPPQT: number;
  POPUPR: number;
  POPLPS: string;
  POPLP2: string;
  POPUUN: string;
  MMUNMS: string;
  MUDMCF: string;
  MUCOFA: number;
  MMGRWE: number;
  MMVOL3: number;
}
