import { Component, Input } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import { IRelatedInformation } from '../../../index';

@Component({
  selector: 'h5-side-panel-links',
  templateUrl: './side-panel-links.component.html',
  styleUrls: ['./side-panel-links.component.css'],
})
export class SidePanelLinksComponent extends CoreBase {
  @Input() relatedInformations!: IRelatedInformation[];

  constructor() {
    super('SidePanelLinksComponent');
  }
}
