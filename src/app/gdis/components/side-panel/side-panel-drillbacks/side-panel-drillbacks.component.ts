import { Component, Input } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import {
  IDrillBack,
  IRelatedInformation,
  DrillbackService,
} from '../../../index';

@Component({
  selector: 'h5-side-panel-drillbacks',
  templateUrl: './side-panel-drillbacks.component.html',
  styleUrls: ['./side-panel-drillbacks.component.css'],
})
export class SidePanelDrillbacksComponent extends CoreBase {
  @Input() relatedInformation!: IRelatedInformation;

  constructor(private readonly drillbackService: DrillbackService) {
    super('SidePanelLinksComponent');
  }

  /**
   * This method is called when the user clicks a drillback.
   * @param drillBack
   * @param relatedInformation
   */
  executeDrillBack(
    drillBack: IDrillBack,
    relatedInformation: IRelatedInformation
  ) {
    this.drillbackService.executeDrillBack(drillBack, relatedInformation);
  }
}
