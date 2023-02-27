import { Component, OnInit } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

@Component({
  selector: 'h5-side-panel-section',
  templateUrl: './side-panel-section.component.html',
  styleUrls: ['./side-panel-section.component.css'],
})
export class SidePanelSectionComponent extends CoreBase {
  constructor() {
    super('SidePanelSectionComponent');
  }
}
