import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoModule } from '@ngneat/transloco';

import { SohoDropDownModule } from 'ids-enterprise-ng';

import { FormModule } from '..';

import { SizeFormComponent } from './size-form.component';

@NgModule({
  declarations: [SizeFormComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    SohoDropDownModule,
    ReactiveFormsModule,
    FormModule,
  ],
  exports: [SizeFormComponent],
})
export class SizeFormModule {}
