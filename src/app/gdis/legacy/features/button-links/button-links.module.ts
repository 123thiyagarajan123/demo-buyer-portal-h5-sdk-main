import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoModule } from '@ngneat/transloco';

import {
  SohoBusyIndicatorModule,
  SohoButtonModule,
  SohoDropDownModule,
} from 'ids-enterprise-ng';

import { ButtonLinkDialogComponent } from './dialogs/button-link-dialog/button-link-dialog.component';
import { DemoButtonLinksPageComponent } from './pages/button-link-page.component';

@NgModule({
  declarations: [ButtonLinkDialogComponent, DemoButtonLinksPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    SohoBusyIndicatorModule,
    SohoDropDownModule,
    SohoButtonModule,
  ],
  exports: [ButtonLinkDialogComponent, DemoButtonLinksPageComponent],
})
export class ButtonLinksModule {}
