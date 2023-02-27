import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SohoIconModule } from 'ids-enterprise-ng';

import { SideCustomPanelActionsComponent } from './side-panel-custom-actions.component';

@NgModule({
  declarations: [SideCustomPanelActionsComponent],
  imports: [CommonModule, SohoIconModule],
  exports: [SideCustomPanelActionsComponent],
})
export class SidePanelCustomActionsModule {}
