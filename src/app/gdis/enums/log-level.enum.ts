import { Log } from '@infor-up/m3-odin';

export enum LogLevel {
  Trace = Log.levelTrace,
  Warning = Log.levelWarning,
  Debug = Log.levelDebug,
  Info = Log.levelInfo,
  Error = Log.levelError,
  Fatal = Log.levelFatal,
}
