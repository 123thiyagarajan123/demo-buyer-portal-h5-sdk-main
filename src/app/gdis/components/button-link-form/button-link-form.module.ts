import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslocoModule } from '@ngneat/transloco';

import { SohoDropDownModule } from 'ids-enterprise-ng';

import { FormModule } from '..';

import { ButtonLinkFormComponent } from './button-link-form.component';

@NgModule({
  declarations: [ButtonLinkFormComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    SohoDropDownModule,
    ReactiveFormsModule,
    FormModule,
  ],
  exports: [ButtonLinkFormComponent],
})
export class ButtonLinkFormModule {}
