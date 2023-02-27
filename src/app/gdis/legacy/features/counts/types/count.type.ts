import { MIRecord } from '@infor-up/m3-odin';

export interface ICount {
  key: MIRecord;
  type: number;
  name: string;
  text: string;
  apiProgram: string;
  apiTransaction: string;
  query: string;
  recordCount?: string;
}
