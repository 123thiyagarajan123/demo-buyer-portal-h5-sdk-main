import { MIRecord } from '@infor-up/m3-odin';

export interface IButtonLink {
  key: MIRecord;
  type: number;
  name: string;
  program?: string;
  option?: number;
  url?: string;
  mashup?: string;
  mashupQuery?: string;
}
