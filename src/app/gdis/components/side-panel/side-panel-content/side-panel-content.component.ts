import { Component, HostBinding, OnInit } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

@Component({
  selector: 'h5-side-panel-content',
  templateUrl: './side-panel-content.component.html',
  styleUrls: ['./side-panel-content.component.css'],
})
export class SidePanelContentComponent extends CoreBase {
  @HostBinding('class.content') get isContent() {
    return true;
  }

  constructor() {
    super('SidePanelContentComponent');
  }
}
