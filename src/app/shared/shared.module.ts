import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslocoModule } from '@ngneat/transloco';

import { SohoComponentsModule } from 'ids-enterprise-ng';

import { GdisModule } from '@gdis/gdis.module';

import { LoremModule, NotFoundModule } from './components';
import { NoDataModule } from './components/no-data/no-data.module';

const angular = [CommonModule, ReactiveFormsModule, FormsModule];

const thirdParty = [TranslocoModule, SohoComponentsModule, GdisModule];

const components = [LoremModule, NotFoundModule, NoDataModule];

const directives: never[] = [];

const importExport = [...angular, ...thirdParty, ...directives, ...components];

@NgModule({
  declarations: [],
  imports: [...importExport],
  exports: [...importExport],
})
export class SharedModule {}
