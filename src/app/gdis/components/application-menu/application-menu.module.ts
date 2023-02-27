import { NgModule } from '@angular/core';

import { SohoApplicationMenuModule } from 'ids-enterprise-ng';

import { ApplicationMenuComponent } from './application-menu.component';

@NgModule({
  declarations: [ApplicationMenuComponent],
  imports: [SohoApplicationMenuModule],
  exports: [ApplicationMenuComponent],
})
export class ApplicationMenuModule {}
