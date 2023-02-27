import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomePageComponent } from './pages';
import {
  ChangeSupplierListComponent,
  ChangeSupplierDialogComponent,
  AddLineListComponent,
  HomeSearchComponent,
  HomeFiltersComponent,
  DatagridComponent,
  AddLineDialogComponent,
} from './components';
import { errorHandler, translationConfiguration } from './providers';

@NgModule({
  declarations: [
    HomePageComponent,
    HomeSearchComponent,
    HomeFiltersComponent,
    DatagridComponent,
    AddLineDialogComponent,
    AddLineListComponent,
    ChangeSupplierDialogComponent,
    ChangeSupplierListComponent,
  ],
  imports: [SharedModule, HomeRoutingModule],
  providers: [errorHandler, translationConfiguration],
})
export class HomeModule {}
