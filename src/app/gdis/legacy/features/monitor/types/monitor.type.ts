import { MIRecord } from '@infor-up/m3-odin';

export interface IMonitor {
  key: MIRecord;
  name: string;
  program: string;
  query: string;
  recordCount?: string;
  sortingOrder?: string;
  severityArrays?: string[][];
  view?: string;
}
