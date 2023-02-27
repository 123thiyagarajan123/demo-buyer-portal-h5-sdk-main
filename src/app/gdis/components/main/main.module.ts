import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SohoBusyIndicatorModule } from 'ids-enterprise-ng';

import { SidePanelModule } from '../side-panel/side-panel.module';

import { MainComponent } from './main.component';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, SidePanelModule, SohoBusyIndicatorModule],
  exports: [MainComponent],
})
export class MainModule {}
