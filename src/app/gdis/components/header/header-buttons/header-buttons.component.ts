import { Component, Input } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import { IHeader } from '../../../index';

@Component({
  selector: 'h5-header-buttons',
  templateUrl: './header-buttons.component.html',
  styleUrls: ['./header-buttons.component.css'],
})
export class HeaderButtonsComponent extends CoreBase {
  @Input() header!: IHeader;

  constructor() {
    super('HeaderButtonsComponent');
  }
}
