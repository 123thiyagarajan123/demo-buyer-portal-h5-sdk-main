import { LogLevel } from '..';

export interface IDebug {
  logLevels: LogLevel[];
  currentLogLevel: LogLevel;
}
