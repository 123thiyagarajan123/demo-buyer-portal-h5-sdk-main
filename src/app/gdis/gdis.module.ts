import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SohoComponentsModule } from 'ids-enterprise-ng';

import {
  CardModule,
  ApplicationMenuModule,
  BreadcrumbModule,
  FormModule,
  FrameModule,
  HeaderModule,
  MainModule,
  SidePanelModule,
  DebugFormModule,
  SizeFormModule,
  ThemeFormModule,
  LanguageFormModule,
  DebugModule,
  PageModule,
  MonitorFormModule,
  ButtonLinkFormModule,
} from './components';
import {
  BookmarkPanelBuilderModule,
  BookmarkPanelModule,
  CardListComponent,
  ChartComponent,
  DatagridComponent,
  DetailComponent,
  MiDropdownComponent,
  MiLookupComponent,
  MiMultiselectComponent,
  MiNavigationComponent,
  RelatedOptionComponent,
  RelatedOptionDialogComponent,
  MonitorModule,
  ButtonLinksModule,
  CountsModule,
} from './legacy';
import { PrettifyTitlePipeModule } from './pipes';

// [START] legacy code (TODO)
const angular = [CommonModule, FormsModule];
const thirdParty = [SohoComponentsModule];
const legacy = [
  DatagridComponent,
  // BookmarkPanelComponent,
  // BookmarkPanelBuilderComponent,
  RelatedOptionComponent,
  RelatedOptionDialogComponent,
  CardListComponent,
  ChartComponent,
  DetailComponent,
  MiDropdownComponent,
  MiLookupComponent,
  MiMultiselectComponent,
  MiNavigationComponent,
];
// [END] legacy code (TODO)

const importExport = [
  HeaderModule,
  SidePanelModule,
  MainModule,
  FrameModule,
  ApplicationMenuModule,
  CardModule,
  BreadcrumbModule,
  FormModule,
  DebugFormModule,
  SizeFormModule,
  ThemeFormModule,
  LanguageFormModule,
  DebugModule,
  PageModule,
  PrettifyTitlePipeModule,
  MonitorFormModule,
  ButtonLinkFormModule,

  // legacy
  BookmarkPanelModule,
  BookmarkPanelBuilderModule,
  MonitorModule,
  ButtonLinksModule,
  CountsModule,
];

@NgModule({
  declarations: [...legacy],
  imports: [...importExport, ...angular, ...thirdParty],
  exports: [...importExport, ...legacy],
})
export class GdisModule {}
