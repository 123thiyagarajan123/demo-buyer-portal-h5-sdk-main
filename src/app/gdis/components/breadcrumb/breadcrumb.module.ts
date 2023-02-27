import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SohoBreadcrumbModule, SohoButtonModule } from 'ids-enterprise-ng';

import { BreadcrumbComponent } from './breadcrumb.component';

@NgModule({
  declarations: [BreadcrumbComponent],
  imports: [CommonModule, RouterModule, SohoBreadcrumbModule, SohoButtonModule],
  exports: [BreadcrumbComponent],
})
export class BreadcrumbModule {}
