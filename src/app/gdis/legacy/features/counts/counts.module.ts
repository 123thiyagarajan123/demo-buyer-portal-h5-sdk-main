import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoModule } from '@ngneat/transloco';

import {
  SohoBusyIndicatorModule,
  SohoButtonModule,
  SohoContextMenuModule,
  SohoDropDownModule,
} from 'ids-enterprise-ng';

import { DemoCountComponent } from './components/count/count.component';
import { CountDialogComponent } from './dialogs/count-dialog/count-dialog.component';
import { DemoCountPageComponent } from './pages/count-page.component';

@NgModule({
  declarations: [
    CountDialogComponent,
    DemoCountComponent,
    DemoCountPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    SohoBusyIndicatorModule,
    SohoDropDownModule,
    SohoButtonModule,
    SohoContextMenuModule,
  ],
  exports: [CountDialogComponent, DemoCountComponent, DemoCountPageComponent],
})
export class CountsModule {}
