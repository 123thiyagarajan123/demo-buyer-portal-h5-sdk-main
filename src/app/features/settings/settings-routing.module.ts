import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  SettingsPageComponent,
  SettingsDebugPageComponent,
  SettingsThemePageComponent,
  SettingsLanguagePageComponent,
  SettingsSizePageComponent,
  SettingsButtonLinkPageComponent,
} from './pages';
import { SettingsMonitorPageComponent } from './pages/settings-monitor-page/settings-monitor-page.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'theme',
        pathMatch: 'full',
      },
      { path: 'theme', component: SettingsThemePageComponent },
      { path: 'size', component: SettingsSizePageComponent },
      { path: 'language', component: SettingsLanguagePageComponent },
      { path: 'debug', component: SettingsDebugPageComponent },
      { path: 'monitor', component: SettingsMonitorPageComponent },
      { path: 'button-link', component: SettingsButtonLinkPageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
