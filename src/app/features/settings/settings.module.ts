import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedModule } from '@shared/shared.module';

import { loader } from './utils';
import { SettingsRoutingModule } from './settings-routing.module';
import {
  SettingsButtonLinkPageComponent,
  SettingsPageComponent,
} from './pages';
import { TabHeaderComponent } from './components';
import { SettingsThemePageComponent } from './pages/settings-theme-page/settings-theme-page.component';
import { SettingsSizePageComponent } from './pages/settings-size-page/settings-size-page.component';
import { SettingsLanguagePageComponent } from './pages/settings-language-page/settings-language-page.component';
import { SettingsDebugPageComponent } from './pages/settings-debug-page/settings-debug-page.component';
import { SettingsMonitorPageComponent } from './pages/settings-monitor-page/settings-monitor-page.component';

@NgModule({
  declarations: [
    SettingsPageComponent,
    TabHeaderComponent,
    SettingsThemePageComponent,
    SettingsSizePageComponent,
    SettingsLanguagePageComponent,
    SettingsDebugPageComponent,
    SettingsMonitorPageComponent,
    SettingsButtonLinkPageComponent,
  ],
  imports: [SharedModule, SettingsRoutingModule],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'settings',
        loader,
      },
    },
  ],
})
export class SettingsModule {}
