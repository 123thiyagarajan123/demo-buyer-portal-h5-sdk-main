import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SohoAccordionModule, SohoIconModule } from 'ids-enterprise-ng';

import { SidePanelActionsModule } from '../side-panel-actions/side-panel-actions.module';
import { SidePanelCustomActionsModule } from '../side-panel-custom-actions/side-panel-custom-actions.module';
import { SidePanelDrillbacksModule } from '../side-panel-drillbacks/side-panel-drillbacks.module';

import { SidePanelLinksComponent } from './side-panel-links.component';

@NgModule({
  declarations: [SidePanelLinksComponent],
  imports: [
    CommonModule,

    SohoAccordionModule,

    SidePanelDrillbacksModule,
    SidePanelActionsModule,
    SidePanelCustomActionsModule,
  ],
  exports: [SidePanelLinksComponent],
})
export class SidePanelLinksModule {}
