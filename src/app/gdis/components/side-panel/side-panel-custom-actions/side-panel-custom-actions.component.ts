import { Component, HostBinding, Input } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import {
  ICustomAction,
  IRelatedInformation,
  ShortcutService,
} from '../../../index';

@Component({
  selector: 'h5-side-panel-custom-actions',
  templateUrl: './side-panel-custom-actions.component.html',
  styleUrls: ['./side-panel-custom-actions.component.css'],
})
export class SideCustomPanelActionsComponent extends CoreBase {
  @Input() relatedInformation!: IRelatedInformation;

  constructor(private readonly shortcutService: ShortcutService) {
    super('SideCustomPanelActionsComponent');
  }

  /**
   * This method is called when the user clicks an 'custom action'.
   * @param customAction
   * @param relatedInformation
   */
  executeCustomAction(
    customAction: ICustomAction,
    relatedInformation: IRelatedInformation
  ) {
    this.shortcutService.customActionClicked(customAction);
  }
}
