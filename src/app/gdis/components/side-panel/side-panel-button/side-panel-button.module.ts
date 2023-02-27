import { NgModule } from '@angular/core';

import { SohoButtonModule } from 'ids-enterprise-ng';

import { SidePanelButtonComponent } from './side-panel-button.component';

@NgModule({
  declarations: [SidePanelButtonComponent],
  imports: [SohoButtonModule],
  exports: [SidePanelButtonComponent],
})
export class SidePanelButtonModule {}
