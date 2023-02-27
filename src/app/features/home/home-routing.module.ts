import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Path } from './enums';
import { HomePageComponent } from './pages';

const routes: Routes = [
  {
    path: Path.Home,
    component: HomePageComponent,
  },
  {
    path: '',
    redirectTo: Path.Home,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
