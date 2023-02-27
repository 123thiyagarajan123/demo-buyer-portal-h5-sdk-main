import { MIRecord } from '@infor-up/m3-odin';

import { IMonitor } from './monitor.type';

export interface IMonitorGroup {
  key: MIRecord;
  name: string;
  monitors: IMonitor[];
}
