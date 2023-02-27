import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SohoButtonModule, SohoSplitterModule } from 'ids-enterprise-ng';

import { SidePanelComponent } from './side-panel.component';
import { SidePanelButtonModule } from './side-panel-button/side-panel-button.module';
import { SidePanelContentModule } from './side-panel-content/side-panel-content.module';
import { SidePanelSectionModule } from './side-panel-section/side-panel-section.module';
import { SidePanelSectionHeaderModule } from './side-panel-section-header/side-panel-section-header.module';
import { SidePanelModalModule } from './side-panel-modal/side-panel-modal.module';
import { SidePanelLinksModule } from './side-panel-links/side-panel-links.module';

@NgModule({
  declarations: [SidePanelComponent],
  imports: [
    CommonModule,
    SohoSplitterModule,
    SohoButtonModule,
    SidePanelButtonModule,
    SidePanelContentModule,
    SidePanelSectionModule,
    SidePanelSectionHeaderModule,
    SidePanelLinksModule,
    SidePanelModalModule, // TODO
  ],
  exports: [SidePanelComponent],
})
export class SidePanelModule {}
