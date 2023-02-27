import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SohoToolbarFlexModule } from 'ids-enterprise-ng';

import { PrettifyTitlePipeModule } from '../../../pipes/prettify-title.pipe';

import { HeaderTitleComponent } from './header-title.component';

@NgModule({
  declarations: [HeaderTitleComponent],
  imports: [CommonModule, SohoToolbarFlexModule, PrettifyTitlePipeModule],
  exports: [HeaderTitleComponent],
})
export class HeaderTitleModule {}
