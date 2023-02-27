import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoModule } from '@ngneat/transloco';

import { SohoDropDownModule } from 'ids-enterprise-ng';

import { FormModule } from '..';

import { LanguageFormComponent } from './language-form.component';

@NgModule({
  declarations: [LanguageFormComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    SohoDropDownModule,
    ReactiveFormsModule,
    FormModule,
  ],
  exports: [LanguageFormComponent],
})
export class LanguageFormModule {}
