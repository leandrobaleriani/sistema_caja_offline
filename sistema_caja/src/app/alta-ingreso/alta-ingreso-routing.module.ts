import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaIngresoPage } from './alta-ingreso.page';

const routes: Routes = [
  {
    path: '',
    component: AltaIngresoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaIngresoPageRoutingModule {}
