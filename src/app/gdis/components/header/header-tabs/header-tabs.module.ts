import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SohoTabsModule } from 'ids-enterprise-ng';

import { HeaderTabsComponent } from './header-tabs.component';

@NgModule({
  declarations: [HeaderTabsComponent],
  imports: [CommonModule, SohoTabsModule],
  exports: [HeaderTabsComponent],
})
export class HeaderTabsModule {}
