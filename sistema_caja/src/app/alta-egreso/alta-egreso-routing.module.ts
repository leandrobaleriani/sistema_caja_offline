import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaEgresoPage } from './alta-egreso.page';

const routes: Routes = [
  {
    path: '',
    component: AltaEgresoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaEgresoPageRoutingModule {}
