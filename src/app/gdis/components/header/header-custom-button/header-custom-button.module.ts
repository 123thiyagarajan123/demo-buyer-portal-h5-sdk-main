import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SohoButtonModule } from 'ids-enterprise-ng';

import { HeaderCustomButtonComponent } from './header-custom-button.component';

@NgModule({
  declarations: [HeaderCustomButtonComponent],
  imports: [CommonModule, SohoButtonModule],
  exports: [HeaderCustomButtonComponent],
})
export class HeaderCustomButtonModule {}
