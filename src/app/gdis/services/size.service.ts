import { Injectable } from '@angular/core';

import { Size } from '../index';

import { GdisStore } from '.';

@Injectable({
  providedIn: 'root',
})
export class SizeService {
  constructor(private store: GdisStore) {}

  getSizes() {
    return this.store.state.size.sizes;
  }

  setFormSize(formSize: Size) {
    if (!formSize) {
      return;
    }

    this.store.setSize({ formSize });
  }

  getFormSize() {
    return this.store.state.size.formSize;
  }

  setRowSize(rowSize: Size) {
    if (!rowSize) {
      return;
    }

    this.store.setSize({ rowSize });
  }

  getRowSize() {
    return this.store.state.size.rowSize;
  }
}
