import { Injectable } from '@angular/core';

import { GdisStore } from './gdis.store';

@Injectable({
  providedIn: 'root',
})
export class SidePanelService {
  constructor(private store: GdisStore) {}

  get isOpen() {
    return this.store.state.sidePanel.isOpen;
  }

  set isOpen(isOpen: boolean) {
    this.store.setSidePanel({ isOpen });
  }

  get width() {
    return this.store.state.sidePanel.width;
  }

  set width(width: string) {
    this.store.setSidePanel({ width });
  }

  resetWidth() {
    this.store.setSidePanel({ width: '250px' });
  }

  toggle() {
    this.store.setSidePanel({
      isOpen: !this.store.state.sidePanel.isOpen,
    });
  }
}
