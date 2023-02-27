import { Component, Input } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

@Component({
  selector: 'h5-side-panel-section-header',
  templateUrl: './side-panel-section-header.component.html',
  styleUrls: ['./side-panel-section-header.component.css'],
})
export class SidePanelSectionHeaderComponent extends CoreBase {
  @Input() header!: string;

  constructor() {
    super('SidePanelSectionHeaderComponent');
  }
}
