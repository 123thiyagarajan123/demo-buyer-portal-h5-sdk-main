import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TranslocoModule } from '@ngneat/transloco';

import {
  SohoBusyIndicatorModule,
  SohoDropDownModule,
  SohoInputModule,
  SohoLabelModule,
} from 'ids-enterprise-ng';

import { FormModule } from '../..';

import { SidePanelModalComponent } from './side-panel-modal.component';

@NgModule({
  declarations: [SidePanelModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    SohoDropDownModule,
    SohoInputModule,
    SohoLabelModule,
    SohoBusyIndicatorModule,
    FormModule,
  ],
  exports: [SidePanelModalComponent],
})
export class SidePanelModalModule {}
