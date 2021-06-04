import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaEgresoPageRoutingModule } from './alta-egreso-routing.module';

import { AltaEgresoPage } from './alta-egreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaEgresoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AltaEgresoPage]
})
export class AltaEgresoPageModule {}
