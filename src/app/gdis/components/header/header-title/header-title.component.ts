import { Component, Input } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import { IHeader } from '../../../index';
import { environment } from '@environments/environment';

@Component({
  selector: 'h5-header-title',
  templateUrl: './header-title.component.html',
  styleUrls: ['./header-title.component.css'],
})
export class HeaderTitleComponent extends CoreBase {
  @Input() header!: IHeader;

  environment = environment;

  constructor() {
    super('HeaderTitleComponent');
  }
}
