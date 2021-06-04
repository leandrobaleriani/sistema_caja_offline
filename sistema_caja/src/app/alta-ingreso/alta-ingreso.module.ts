import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaIngresoPageRoutingModule } from './alta-ingreso-routing.module';

import { AltaIngresoPage } from './alta-ingreso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaIngresoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AltaIngresoPage]
})
export class AltaIngresoPageModule {}
