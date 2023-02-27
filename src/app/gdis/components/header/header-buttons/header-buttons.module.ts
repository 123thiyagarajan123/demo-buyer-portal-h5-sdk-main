import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SohoButtonModule } from 'ids-enterprise-ng';

import { HeaderButtonsComponent } from './header-buttons.component';

@NgModule({
  declarations: [HeaderButtonsComponent],
  imports: [CommonModule, SohoButtonModule],
  exports: [HeaderButtonsComponent],
})
export class HeaderButtonsModule {}
