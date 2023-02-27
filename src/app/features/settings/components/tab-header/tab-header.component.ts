import { Component } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import { Tab } from '../../enums';

@Component({
  selector: 'app-tab-header',
  templateUrl: './tab-header.component.html',
  styleUrls: ['./tab-header.component.css'],
})
export class TabHeaderComponent extends CoreBase {
  Tab = Tab;

  constructor() {
    super('TabHeaderComponent');
  }
}
