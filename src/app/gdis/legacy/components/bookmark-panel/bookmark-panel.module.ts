import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SohoComponentsModule } from 'ids-enterprise-ng';

import { BookmarkPanelBuilderModule } from '../bookmark-panel-builder/bookmark-panel-builder.module';

import { BookmarkPanelComponent } from './bookmark-panel.component';

@NgModule({
  declarations: [BookmarkPanelComponent],
  imports: [CommonModule, SohoComponentsModule, BookmarkPanelBuilderModule],
  exports: [BookmarkPanelComponent],
})
export class BookmarkPanelModule {}
