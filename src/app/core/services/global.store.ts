import { Injectable } from '@angular/core';

import { IGlobalStore } from '@core/types';

import { Store } from '../models';

@Injectable({
  providedIn: 'root',
})
export class GlobalStore extends Store<IGlobalStore> {
  constructor() {
    super({}, 'GlobalStore');
  }

  update(data: Partial<{ [key: string]: any }>): void {
    this.setState({
      ...this.state,
      ...data,
    });
  }
}
