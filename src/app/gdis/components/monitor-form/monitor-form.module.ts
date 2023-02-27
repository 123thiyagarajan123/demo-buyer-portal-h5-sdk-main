import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoModule } from '@ngneat/transloco';

import { SohoDropDownModule } from 'ids-enterprise-ng';

import { FormModule } from '..';

import { MonitorFormComponent } from './monitor-form.component';

@NgModule({
  declarations: [MonitorFormComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    SohoDropDownModule,
    ReactiveFormsModule,
    FormModule,
  ],
  exports: [MonitorFormComponent],
})
export class MonitorFormModule {}
