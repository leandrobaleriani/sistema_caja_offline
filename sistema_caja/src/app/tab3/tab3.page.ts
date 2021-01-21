import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { LoadingController, ToastController } from "@ionic/angular";
import { Movimiento } from "../model/Movimiento";
import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page {
  busqueda: FormGroup;
  movimientos: Movimiento[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private firebaseService: FirebaseService
  ) {
    this.busqueda = this.formBuilder.group({
      desde: new Date().toISOString(),
      hasta: new Date().toISOString(),
    });
  }

  exportar() {}

  imprimir() {}

  async buscar() {
    let loading = await this.loadingController.create({
      message: "Espere...",
      spinner: "crescent",
    });

    const toast = await this.toastController.create({
      color: "danger",
      message: "Error al buscar los productos! Intente nuevamente",
      duration: 2000,
    });

    await loading.present();
    let fechaInicio = new Date(this.busqueda.controls.desde.value);
    let fechaFin = new Date(this.busqueda.controls.hasta.value);

    let desde = new Date(
      fechaInicio.getFullYear(),
      fechaInicio.getMonth(),
      fechaInicio.getDate(),
      0,
      0,
      0
    ).toISOString();
    let hasta = new Date(
      fechaFin.getFullYear(),
      fechaFin.getMonth(),
      fechaFin.getDate(),
      23,
      59,
      59
    ).toISOString();
    await this.firebaseService.getIngresosByDate(desde, hasta).subscribe(
      (data) => {
        this.movimientos = data;
        loading.dismiss();
      },
      (error) => {
        console.log(error);
        toast.present();
        loading.dismiss();
      }
    );
  }
}
