import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SohoEmptyMessageModule } from 'ids-enterprise-ng';

import { NoDataComponent } from './no-data.component';

@NgModule({
  declarations: [NoDataComponent],
  imports: [CommonModule, SohoEmptyMessageModule],
  exports: [NoDataComponent],
})
export class NoDataModule {}
