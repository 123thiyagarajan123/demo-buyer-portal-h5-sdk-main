import { MIRecord } from '@infor-up/m3-odin';

export interface SohoDataGridSelectedEventLight {
  rows: SohoDataGridData[];
}

export interface SohoDataGridData {
  data: MIRecord;
}
