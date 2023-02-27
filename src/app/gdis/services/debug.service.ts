import { Injectable } from '@angular/core';

import { Log } from '@infor-up/m3-odin';

import { LogLevel } from '..';

import { GdisStore } from '.';

@Injectable({
  providedIn: 'root',
})
export class DebugService {
  constructor(private store: GdisStore) {}

  get logLevels() {
    return this.store.state.debug.logLevels;
  }

  get currentLogLevel() {
    return this.store.state.debug.currentLogLevel;
  }

  set currentLogLevel(currentLogLevel: LogLevel) {
    Log.level = currentLogLevel;
    this.store.setDebug({ currentLogLevel });
  }
}
