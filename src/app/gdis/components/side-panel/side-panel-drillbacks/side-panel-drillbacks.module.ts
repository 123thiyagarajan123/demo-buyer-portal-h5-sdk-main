import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SohoIconModule } from 'ids-enterprise-ng';

import { SidePanelDrillbacksComponent } from './side-panel-drillbacks.component';

@NgModule({
  declarations: [SidePanelDrillbacksComponent],
  imports: [CommonModule, SohoIconModule],
  exports: [SidePanelDrillbacksComponent],
})
export class SidePanelDrillbacksModule {}
