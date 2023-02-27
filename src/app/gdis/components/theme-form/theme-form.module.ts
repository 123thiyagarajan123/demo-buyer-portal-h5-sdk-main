import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoModule } from '@ngneat/transloco';

import { SohoDropDownModule } from 'ids-enterprise-ng';

import { FormModule } from '../form/form.module';

import { ThemeFormComponent } from './theme-form.component';

@NgModule({
  declarations: [ThemeFormComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    SohoDropDownModule,
    ReactiveFormsModule,
    FormModule,
  ],
  exports: [ThemeFormComponent],
})
export class ThemeFormModule {}
