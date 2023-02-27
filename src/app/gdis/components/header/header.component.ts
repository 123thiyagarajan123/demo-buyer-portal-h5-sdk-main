import { Component, HostBinding } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import { HeaderService, GdisStore } from '../../index';

@Component({
  selector: 'h5-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent extends CoreBase {
  @HostBinding('class.header') get isHeader() {
    return true;
  }
  @HostBinding('class.is-personalizable') get isPersonalizable() {
    return true;
  }
  @HostBinding('class.has-toolbar') get hasToolbar() {
    return this.headerService.hasToolbar;
  }
  @HostBinding('class.has-tabs') get hasTabs() {
    return this.headerService.hasTabs;
  }

  store$ = this.store.state$;

  constructor(public headerService: HeaderService, public store: GdisStore) {
    super('HeaderComponent');
  }
}
