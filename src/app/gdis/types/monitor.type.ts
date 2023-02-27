import { MonitorLevel } from '..';

export interface IMonitor {
  monitorLevels: MonitorLevel[];
  currentMonitorLevel: MonitorLevel;
}
