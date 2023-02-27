import { MIRecord } from '@infor-up/m3-odin';

export interface ISupplierFilter extends MIRecord {
  POSUNO: string;
  IDSUNM: string;
  F_WHLO: string;
  T_WHLO: string;
  F_ACTP: string;
  T_ACTP: string;
  F_RELD: string;
  T_RELD: string;
  POBUYE: string;
}
