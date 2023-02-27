import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SohoComponentsModule } from 'ids-enterprise-ng';

import { BookmarkPanelBuilderComponent } from './bookmark-panel-builder.component';

@NgModule({
  declarations: [BookmarkPanelBuilderComponent],
  imports: [CommonModule, FormsModule, SohoComponentsModule],
  exports: [BookmarkPanelBuilderComponent],
})
export class BookmarkPanelBuilderModule {}
