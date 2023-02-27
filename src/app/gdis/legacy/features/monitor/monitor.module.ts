import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoModule } from '@ngneat/transloco';

import {
  SohoBusyIndicatorModule,
  SohoButtonModule,
  SohoCardModule,
  SohoContextMenuModule,
  SohoListViewModule,
  SohoPopupMenuModule,
  SohoSliderModule,
} from 'ids-enterprise-ng';

import { DemoMonitorGroupComponent } from './components/monitor-group/monitor-group.component';
import { DemoMonitorComponent } from './components/monitor/monitor.component';
import { DemoMonitorDialogComponent } from './dialogs/monitor-dialog/monitor-dialog.component';
import { DemoMonitorGroupDialogComponent } from './dialogs/monitor-group-dialog/monitor-group-dialog.component';
import { DemoSeverityIndicatorDialogComponent } from './dialogs/severity-indicator-dialog/severity-indicator-dialog.component';
import { DemoMonitorGroupPageComponent } from './pages/monitor-group-page.component';

@NgModule({
  declarations: [
    DemoMonitorComponent,
    DemoMonitorGroupComponent,
    DemoMonitorDialogComponent,
    DemoMonitorGroupDialogComponent,
    DemoSeverityIndicatorDialogComponent,
    DemoMonitorGroupPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslocoModule,
    SohoBusyIndicatorModule,
    SohoCardModule,
    SohoSliderModule,
    SohoButtonModule,
    SohoListViewModule,
    SohoPopupMenuModule,
    SohoContextMenuModule,
  ],
  exports: [
    DemoMonitorComponent,
    DemoMonitorGroupComponent,
    DemoMonitorDialogComponent,
    DemoMonitorGroupDialogComponent,
    DemoSeverityIndicatorDialogComponent,
    DemoMonitorGroupPageComponent,
  ],
})
export class MonitorModule {}
