import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SohoAccordionModule, SohoIconModule } from 'ids-enterprise-ng';

import { SidePanelActionsModalModule } from '../side-panel-actions-modal/side-panel-actions-modal.module';

import { SidePanelActionsComponent } from './side-panel-actions.component';

@NgModule({
  declarations: [SidePanelActionsComponent],
  imports: [
    CommonModule,
    SidePanelActionsModalModule,
    SohoAccordionModule,
    SohoIconModule,
  ],
  exports: [SidePanelActionsComponent],
})
export class SidePanelActionsModule {}
