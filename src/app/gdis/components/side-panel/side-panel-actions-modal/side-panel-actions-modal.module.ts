import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslocoModule } from '@ngneat/transloco';

import { SohoBusyIndicatorModule } from 'ids-enterprise-ng';

import { BookmarkPanelModule } from '../../../legacy/components/bookmark-panel/bookmark-panel.module';

import { SidePanelActionsModalComponent } from './side-panel-actions-modal.component';

@NgModule({
  declarations: [SidePanelActionsModalComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    SohoBusyIndicatorModule,
    BookmarkPanelModule,
  ],
  exports: [SidePanelActionsModalComponent],
})
export class SidePanelActionsModalModule {}
