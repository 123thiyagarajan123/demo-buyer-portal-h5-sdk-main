import { Injectable } from '@angular/core';

import { MonitorLevel } from '@gdis/enums';

import { GdisStore } from '.';

@Injectable({
  providedIn: 'root',
})
export class MonitorService {
  constructor(private store: GdisStore) {}

  get monitorLevels() {
    return this.store.state.monitor.monitorLevels;
  }

  get currentMonitorLevel() {
    return this.store.state.monitor.currentMonitorLevel;
  }

  set currentMonitorLevel(currentMonitorLevel: MonitorLevel) {
    this.store.setMonitor({ currentMonitorLevel });
  }
}
