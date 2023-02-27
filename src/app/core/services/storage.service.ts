import { Inject, Injectable } from '@angular/core';

import { Storage } from '@core/enums/storage.enum';
import { WINDOW } from '@core/tokens/window.token';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  readonly PREFIX = environment.title;

  constructor(@Inject(WINDOW) readonly window: Window) {}

  storage(storage: Storage) {
    if (storage === Storage.Local) {
      return this.window.localStorage;
    }

    return this.window.sessionStorage;
  }

  get(key: string, storage: Storage) {
    return this.storage(storage).getItem(`${this.PREFIX}_${key}`);
  }

  set(key: string, value: string, storage: Storage) {
    this.storage(storage).setItem(`${this.PREFIX}_${key}`, value);
  }

  remove(key: string, storage: Storage) {
    this.storage(storage).removeItem(`${this.PREFIX}_${key}`);
  }

  clear(storage: Storage) {
    this.storage(storage).clear();
  }
}
