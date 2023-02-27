import { Component } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import { GdisStore } from '../../index';

@Component({
  selector: 'h5-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css'],
})
export class DebugComponent extends CoreBase {
  store$ = this.store.state$;

  constructor(private store: GdisStore) {
    super('DebugComponent');
  }
}
