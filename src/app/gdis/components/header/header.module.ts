import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SohoHeaderModule, SohoToolbarFlexModule } from 'ids-enterprise-ng';

import { HeaderComponent } from './header.component';
import { HeaderCustomButtonModule } from './header-custom-button/header-custom-button.module';
import { HeaderTitleModule } from './header-title/header-title.module';
import { HeaderButtonsModule } from './header-buttons/header-buttons.module';
import { HeaderTabsModule } from './header-tabs/header-tabs.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    SohoHeaderModule,
    SohoToolbarFlexModule,
    HeaderTitleModule,
    HeaderCustomButtonModule,
    HeaderButtonsModule,
    HeaderTabsModule,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
